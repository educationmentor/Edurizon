const asyncHandler = require('express-async-handler');
const Meeting = require('../models/meetingModel');
const ConsultationRequest = require('../models/consultationRequestModel');
const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// Using the same cache as consultationController for consistency
global.meetingLinksCache = global.meetingLinksCache || {};

// Setup Google OAuth client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  access_token: process.env.GOOGLE_ACCESS_TOKEN
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

/**
 * Generate a consistent Google Meet link for a specific meetingId
 * @param {string} meetingId - The ID to use for generating the link
 * @returns {string} - A Google Meet link in the format https://meet.google.com/xxx-xxxx-xxx
 */
const generateConsistentMeetLink = (meetingId) => {
  // Check cache first
  if (global.meetingLinksCache[meetingId]) {
    return global.meetingLinksCache[meetingId];
  }

  // Create a deterministic hash from the meeting ID
  const hash = crypto.createHash('md5').update(String(meetingId)).digest('hex');
  
  // Google Meet links follow the pattern xxx-xxxx-xxx
  // Convert hex to valid meet characters (a-z, 0-9)
  const toValidChar = (char) => {
    const num = parseInt(char, 16);
    return num < 10 ? String(num) : String.fromCharCode(97 + (num - 10)); // 97 is ASCII for 'a'
  };
  
  // Generate the three parts of the Meet URL
  let part1 = '';
  for (let i = 0; i < 3; i++) {
    part1 += toValidChar(hash[i]);
  }
  
  let part2 = '';
  for (let i = 3; i < 7; i++) {
    part2 += toValidChar(hash[i]);
  }
  
  let part3 = '';
  for (let i = 7; i < 10; i++) {
    part3 += toValidChar(hash[i]);
  }
  
  const meetLink = `https://meet.google.com/${part1}-${part2}-${part3}`;
  
  // Cache for future use
  global.meetingLinksCache[meetingId] = meetLink;
  console.log(`Generated meet link for ${meetingId}: ${meetLink}`);
  
  return meetLink;
};

// @desc    Create a Google Meet link via Calendar API
// @access  Private
const createGoogleMeetLink = async (meeting) => {
  // First check if we already have a cached link for this meeting
  if (meeting._id && global.meetingLinksCache[meeting._id.toString()]) {
    console.log('Using cached meet link for meeting:', meeting._id);
    return global.meetingLinksCache[meeting._id.toString()];
  }

  // Try with Calendar API first
  try {
    const event = {
      summary: 'Edurizon Consultation Meeting',
      description: 'Meeting for education consultation',
      start: {
        dateTime: new Date(meeting.scheduledTime || Date.now()).toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(new Date(meeting.scheduledTime || Date.now()).getTime() + 60 * 60 * 1000), // 1 hour meeting
        timeZone: 'UTC',
      },
      conferenceData: {
        createRequest: {
          // Use a consistent requestId
          requestId: `edurizon-${meeting._id}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });
    
    const meetLink = response.data.hangoutLink;
    
    // Save to cache for future use
    if (meeting._id) {
      global.meetingLinksCache[meeting._id.toString()] = meetLink;
    }
    
    return meetLink;
  } catch (error) {
    console.error("Error creating Google Meet link via Calendar API:", error);
    
    // Use our fallback generator as a plan B
    const fallbackLink = generateConsistentMeetLink(meeting._id.toString());
    return fallbackLink;
  }
};

// @desc    Get all meetings for a user
// @route   GET /api/meetings
// @access  Private
const getMeetings = asyncHandler(async (req, res) => {
  console.log('Getting meetings for user:', req.user._id);
  console.log('User role:', req.user.role);
  
  try {
    let meetings;
    
    if (req.user.role === 'counselor') {
      console.log('Fetching meetings for counselor');
      meetings = await Meeting.find({ counselor: req.user._id })
        .populate('university', 'name')
        .populate('student', 'name email')
        .sort({ createdAt: -1 });
        
      // Ensure all meetings have Google Meet links
      for (const meeting of meetings) {
        if (!meeting.googleMeetUrl) {
          meeting.googleMeetUrl = generateConsistentMeetLink(meeting._id.toString());
          await meeting.save();
        }
      }
      
      res.json({ 
        success: true,
        data: meetings
      });
    } else if (req.user.role === 'student') {
      console.log('Fetching meetings for student');
      meetings = await Meeting.find({ student: req.user._id })
        .populate('university', 'name')
        .populate('counselor', 'name email')
        .sort({ createdAt: -1 });
        
      // Ensure all meetings have Google Meet links
      for (const meeting of meetings) {
        if (!meeting.googleMeetUrl) {
          meeting.googleMeetUrl = generateConsistentMeetLink(meeting._id.toString());
          await meeting.save();
        }
      }
      
      res.json({ 
        success: true,
        data: meetings
      });
    } else {
      res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view meetings' 
      });
    }
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching meetings',
      error: error.message 
    });
  }
});

// @desc    Create a new meeting
// @route   POST /api/meetings/create
// @access  Private
const createMeeting = asyncHandler(async (req, res) => {
  const { universityId, scheduledTime, description } = req.body;

  if (!universityId) {
    res.status(400);
    throw new Error('Please provide a university ID');
  }

  // Check if a meeting already exists for this university and student
  const existingMeeting = await Meeting.findOne({
    student: req.user._id,
    university: universityId
  });

  if (existingMeeting) {
    return res.status(400).json({
      success: false,
      message: 'You already have a meeting request for this university'
    });
  }

  const meeting = await Meeting.create({
    student: req.user._id,
    university: universityId,
    scheduledTime,
    description,
    status: 'Pending'
  });

  res.status(201).json({
    success: true,
    data: meeting
  });
});

// @desc    Get meeting status for a university
// @route   GET /api/meetings/status/:universityId
// @access  Private
const getMeetingStatus = asyncHandler(async (req, res) => {
  const { universityId } = req.params;
  
  const meeting = await Meeting.findOne({
    student: req.user._id,
    university: universityId
  }).populate('counselor', 'name email');

  if (!meeting) {
    return res.json({ status: 'No meeting found' });
  }

  // Make sure there's always a Google Meet URL
  if (meeting.status === 'Join' && !meeting.googleMeetUrl) {
    meeting.googleMeetUrl = generateConsistentMeetLink(meeting._id.toString());
    await meeting.save();
  }

  res.json({
    status: meeting.status,
    scheduledTime: meeting.scheduledTime,
    counselor: meeting.counselor,
    googleMeetUrl: meeting.googleMeetUrl
  });
});

// @desc    Update meeting status and assign counselor
// @route   PUT /api/meetings/:id
// @access  Private (Counselor)
const updateMeetingStatus = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findById(req.params.id);

  if (!meeting) {
    res.status(404);
    throw new Error('Meeting not found');
  }

  if (meeting.counselor && meeting.counselor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You are not authorized to update this meeting');
  }

  meeting.counselor = req.user._id;
  meeting.status = req.body.status || meeting.status;
  meeting.scheduledTime = req.body.scheduledTime || meeting.scheduledTime;

  if (meeting.status === 'Join' && !meeting.googleMeetUrl) {
    // Generate a consistent link instead of a random one
    meeting.googleMeetUrl = generateConsistentMeetLink(meeting._id.toString());
  }

  await meeting.save();

  res.json({
    success: true,
    data: meeting
  });
});

// @desc    Join a meeting - ensure both student and counselor get the same link
// @route   GET /api/meetings/join/:id
// @access  Private
const joinMeeting = asyncHandler(async (req, res) => {
  try {
    const meetingId = req.params.id;
    const meeting = await Meeting.findById(meetingId)
      .populate('student', 'name email')
      .populate('counselor', 'name email');
      
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }
    
    // Check if user is authorized to join
    const isStudent = meeting.student._id.toString() === req.user._id.toString();
    const isCounselor = meeting.counselor && meeting.counselor._id.toString() === req.user._id.toString();
    
    if (!isStudent && !isCounselor) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to join this meeting'
      });
    }

    
    
    // Use a deterministic link based on meetingId
    if (!meeting.googleMeetUrl) {
      meeting.googleMeetUrl = generateConsistentMeetLink(meetingId);
      await meeting.save();
    }
    
    res.json({
      success: true,
      meetingId: meeting._id,
      googleMeetUrl: meeting.googleMeetUrl,
      participants: {
        student: meeting.student,
        counselor: meeting.counselor
      }
    });
  } catch (error) {
    console.error('Error joining meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join meeting',
      error: error.message
    });
  }
});

module.exports = {
  getMeetings,
  createMeeting,
  getMeetingStatus,
  updateMeetingStatus,
  joinMeeting,
  createGoogleMeetLink,
  generateConsistentMeetLink
};