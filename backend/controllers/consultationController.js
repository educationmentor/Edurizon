const asyncHandler = require('express-async-handler');
const ConsultationRequest = require('../models/consultationRequestModel');
const { generateMeetLink, calendar } = require('../utils/googleMeet');
const Consultation = require('../models/consultationModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');

// @desc    Create a new consultation request
// @route   POST /api/consultation/request
// @access  Public
const createConsultationRequest = asyncHandler(async (req, res) => {
    try {
        const { name, email, phone, interestedCountry, homeCountry, interestedCourse } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !interestedCountry || !homeCountry || !interestedCourse) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

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
// @route   POST /api/consultation/accept/:requestId
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

    // Generate Google Meet link
    let meetLink;
    try {
      meetLink = await generateMeetLink(request.name);
    } catch (error) {
      console.error('Failed to generate Meet link:', error);
      // Fallback to a temporary link
      meetLink = `https://meet.google.com/temp-${Date.now()}`;
    }

    // Update request status and details
    request.status = 'accepted';
    request.acceptedBy = req.user._id;
    request.googleMeetLink = meetLink;
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
    status: 'accepted',
    acceptedBy: req.user._id
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

// Create a new consultation request
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

// Get all consultation requests (for counselors)
const getConsultations = asyncHandler(async (req, res) => {
  const consultations = await Consultation.find()
    .sort({ createdAt: -1 })
    .populate('counselor', 'name email');

  res.status(200).json({
    success: true,
    data: consultations
  });
});

// Update consultation status (for counselors)
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

// Get consultations by email (for students)
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
// @route   POST /api/consultation/schedule/:requestId
// @access  Private (Counselor only)
const scheduleMeeting = asyncHandler(async (req, res) => {
  const { meetingTime } = req.body;
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

  // Generate Google Meet link with the scheduled time
  const event = {
    summary: `Edurizon Consultation with ${request.name}`,
    description: 'Consultation session for education counseling',
    start: {
      dateTime: meetingTime,
      timeZone: 'UTC',
    },
    end: {
      dateTime: new Date(new Date(meetingTime).getTime() + 3600000).toISOString(), // 1 hour meeting
      timeZone: 'UTC',
    },
    conferenceData: {
      createRequest: {
        requestId: `edurizon-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };

  try {
    let meetLink;
    try {
      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1
      });
      meetLink = response.data.hangoutLink;
    } catch (error) {
      console.error('Failed to create Google Meet event:', error);
      // Fallback to temporary link for development/testing
      meetLink = `https://meet.google.com/test-${Date.now()}`;
    }

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
    res.status(500);
    throw new Error('Failed to schedule meeting: ' + error.message);
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

    console.log('Sending notifications for email:', email);
    console.log('Total notifications:', allNotifications.length);

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