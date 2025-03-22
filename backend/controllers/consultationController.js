const asyncHandler = require('express-async-handler');
const ConsultationRequest = require('../models/consultationRequestModel');
const Consultation = require('../models/consultationModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const { generateMeetLink, generateFallbackMeetLink } = require('../utils/googleMeet');
const crypto = require('crypto');

// @desc    Create a new consultation request
// @route   POST /api/consultation/request
// @access  Private
const createConsultationRequest = asyncHandler(async (req, res) => {
    try {
        const { name, email, phone, interestedCountry, homeCountry, interestedCourse } = req.body;

        // Create consultation request
        const request = await ConsultationRequest.create({
            name,
            email,
            phone,
            interestedCountry,
            homeCountry,
            interestedCourse,
            status: 'pending'
        });

        // Create notification for the student
        await Notification.create({
            userId: email,
            title: 'Consultation Request Submitted',
            message: 'Your consultation request has been submitted successfully.',
            type: 'consultation',
            read: false
        });

        res.status(201).json({
            success: true,
            message: 'Consultation request created successfully',
            data: request
        });
    } catch (error) {
        console.error('Error creating consultation request:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating consultation request',
            error: error.message
        });
    }
});

// @desc    Get all pending consultation requests
// @route   GET /api/consultation/pending
// @access  Private (Counselor only)
const getPendingRequests = asyncHandler(async (req, res) => {
  const requests = await ConsultationRequest.find({ status: 'pending' })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: requests
  });
});

// @desc    Accept a consultation request
// @route   PUT /api/consultation/accept/:requestId
// @access  Private (Counselor only)
const acceptRequest = asyncHandler(async (req, res) => {
  try {
    const request = await ConsultationRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request no longer available'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request cannot be accepted. Current status: ${request.status}`
      });
    }

    // Update request status and counselor details
    request.status = 'accepted';
    request.acceptedBy = req.user._id;
    await request.save();

    // Create notification for the student
    await Notification.create({
      userId: request.email,
      title: 'Consultation Request Accepted',
      message: `Your consultation request has been accepted by ${req.user.name}.`,
      type: 'consultation',
      read: false
    });

    return res.json({
      success: true,
      message: 'Request accepted successfully',
      data: request
    });
  } catch (error) {
    console.error('Error accepting request:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to accept request',
      error: error.message
    });
  }
});

// @desc    Get accepted consultation requests for a counselor
// @route   GET /api/consultation/accepted
// @access  Private (Counselor only)
const getAcceptedRequests = asyncHandler(async (req, res) => {
  const requests = await ConsultationRequest.find({
    $or: [
      { status: 'accepted', acceptedBy: req.user._id },
      { status: 'scheduled', acceptedBy: req.user._id }
    ]
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: requests
  });
});

// @desc    Get consultation requests for a student
// @route   GET /api/consultation/student
// @access  Public
const getStudentRequests = asyncHandler(async (req, res) => {
  const { email } = req.query;

  if (!email) {
    res.status(400);
    throw new Error('Please provide student email');
  }

  const requests = await ConsultationRequest.find({ email })
    .populate('acceptedBy', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: requests
  });
});

// @desc    Create a new consultation
// @route   POST /api/consultation/create
// @access  Private
const createConsultation = asyncHandler(async (req, res) => {
  const { name, email, phone, preferredDate, preferredTime, message } = req.body;

  // Create new consultation request
  const consultation = await Consultation.create({
    name,
    email,
    phone,
    preferredDate,
    preferredTime,
    message
  });

  // Find available counselors and notify them (this can be expanded later)
  const counselors = await User.find({ role: 'counselor' });
  
  // Here you can add notification logic for counselors
  // For now, we'll just return success

  res.status(201).json({
    success: true,
    message: 'Consultation request created successfully',
    data: consultation
  });
});

// @desc    Get all consultation requests (for counselors)
// @route   GET /api/consultation
// @access  Private (Counselor only)
const getConsultations = asyncHandler(async (req, res) => {
  const consultations = await Consultation.find()
    .sort({ createdAt: -1 })
    .populate('counselor', 'name email');

  res.status(200).json({
    success: true,
    data: consultations
  });
});

// @desc    Update consultation status (for counselors)
// @route   PUT /api/consultation/:consultationId
// @access  Private (Counselor only)
const updateConsultation = asyncHandler(async (req, res) => {
  const { consultationId } = req.params;
  const { status, counselorId } = req.body;

  const consultation = await Consultation.findByIdAndUpdate(
    consultationId,
    {
      status,
      counselor: counselorId,
      ...(status === 'accepted' && { acceptedAt: Date.now() })
    },
    { new: true }
  ).populate('counselor', 'name email');

  if (!consultation) {
    return res.status(404).json({
      success: false,
      message: 'Consultation not found'
    });
  }

  res.status(200).json({
    success: true,
    data: consultation
  });
});

// @desc    Get consultations by email (for students)
// @route   GET /api/consultation/email
// @access  Private
const getConsultationsByEmail = asyncHandler(async (req, res) => {
  const { email } = req.query;

  const consultations = await Consultation.find({ email })
    .sort({ createdAt: -1 })
    .populate('counselor', 'name email');

  res.status(200).json({
    success: true,
    data: consultations
  });
});

// @desc    Schedule a consultation meeting
// @route   PUT /api/consultation/schedule/:requestId
// @access  Private (Counselor only)
const scheduleMeeting = asyncHandler(async (req, res) => {
  const { meetingTime } = req.body;
  
  if (!meetingTime) {
    res.status(400);
    throw new Error('Meeting time is required');
  }
  
  try {
    const request = await ConsultationRequest.findById(req.params.requestId);

    if (!request) {
      res.status(404);
      throw new Error('Consultation request not found');
    }

    if (request.status !== 'accepted') {
      res.status(400);
      throw new Error('Request must be accepted before scheduling');
    }

    if (!request.acceptedBy.equals(req.user._id)) {
      res.status(403);
      throw new Error('Only the accepting counselor can schedule this meeting');
    }

    // Parse and format the meeting time correctly
    const startTime = new Date(meetingTime);
    // Set end time to be 1 hour after start time
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    
    // Create a calendar event with a Google Meet link
    const event = {
      summary: `Edurizon Consultation with ${request.name}`,
      description: 'Consultation session for education counseling',
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'UTC',
      },
      conferenceData: {
        createRequest: {
          requestId: `edurizon-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };

    let meetLink;
    try {
      // Try to generate a real Google Meet link via Calendar API
      meetLink = await generateMeetLink(request.name, meetingTime);
    } catch (error) {
      console.error('Failed to create Google Meet event:', error);
      
      // Generate a fallback link with crypto
      meetLink = generateFallbackMeetLink();
    }

    // Update the request with meeting details
    request.meetingTime = meetingTime;
    request.googleMeetLink = meetLink;
    request.status = 'scheduled';
    await request.save();

    // Create a notification for the student
    await Notification.create({
      userId: request.email,
      title: 'Consultation Meeting Scheduled',
      message: `Your consultation has been scheduled for ${new Date(meetingTime).toLocaleString()}`,
      type: 'consultation',
      link: meetLink,
      read: false
    });

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Failed to schedule meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule meeting',
      error: error.message
    });
  }
});

// @desc    Reject a consultation request
// @route   PUT /api/consultation/reject/:requestId
// @access  Private (Counselor only)
const rejectRequest = asyncHandler(async (req, res) => {
  try {
    const request = await ConsultationRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Consultation request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This request cannot be rejected in its current state'
      });
    }

    request.status = 'rejected';
    await request.save();

    // Create notification for the student
    await Notification.create({
      userId: request.email,
      title: 'Consultation Request Rejected',
      message: 'Your consultation request has been rejected. Please try booking another slot.',
      type: 'consultation',
      read: false
    });

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting consultation request'
    });
  }
});

// @desc    Get notifications for a student
// @route   GET /api/consultation/notifications
// @access  Private
const getStudentNotifications = asyncHandler(async (req, res) => {
  const { email } = req.query;

  if (!email) {
    res.status(400);
    throw new Error('Please provide student email');
  }

  try {
    // Get both consultation requests and direct notifications
    const [requests, notifications] = await Promise.all([
      ConsultationRequest.find({ email })
        .populate('acceptedBy', 'name email')
        .sort({ createdAt: -1 }),
      Notification.find({ userId: email })
        .sort({ createdAt: -1 })
    ]);

    // Transform requests into notification format
    const requestNotifications = requests.map(request => ({
      _id: request._id,
      status: request.status,
      acceptedBy: request.acceptedBy,
      meetingTime: request.meetingTime,
      googleMeetLink: request.googleMeetLink,
      title: getNotificationTitle(request.status),
      message: getNotificationMessage(request),
      createdAt: request.createdAt,
      type: 'consultation'
    }));

    // Combine both types of notifications and sort by creation date
    const allNotifications = [...requestNotifications, ...notifications]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      data: allNotifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
});

// Helper function to get notification title
const getNotificationTitle = (status) => {
  switch (status) {
    case 'pending':
      return 'Consultation Request Pending';
    case 'accepted':
      return 'Consultation Request Accepted';
    case 'scheduled':
      return 'Consultation Meeting Scheduled';
    case 'completed':
      return 'Consultation Completed';
    default:
      return 'Consultation Update';
  }
};

// Helper function to get notification message
const getNotificationMessage = (request) => {
  switch (request.status) {
    case 'pending':
      return 'Your consultation request is being reviewed.';
    case 'accepted':
      return `Your consultation request has been accepted by ${request.acceptedBy?.name || 'a counselor'}.`;
    case 'scheduled':
      return `Your consultation has been scheduled for ${new Date(request.meetingTime).toLocaleString()}.`;
    case 'completed':
      return 'Your consultation has been completed.';
    default:
      return 'Your consultation request has been updated.';
  }
};

module.exports = {
  createConsultationRequest,
  getPendingRequests,
  acceptRequest,
  getAcceptedRequests,
  getStudentRequests,
  createConsultation,
  getConsultations,
  updateConsultation,
  getConsultationsByEmail,
  scheduleMeeting,
  rejectRequest,
  getStudentNotifications,
};