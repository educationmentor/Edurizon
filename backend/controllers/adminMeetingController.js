const asyncHandler = require('express-async-handler');
const Meeting = require('../models/meetingModel');
const AdminUser = require('../models/AdminUser');
const { createZoomMeeting } = require('../utils/zoomApi');
const { sendWhatsAppNotification } = require('../utils/whatsappApi');

// @desc    Schedule a new meeting with Zoom integration
// @route   POST /api/admin/schedule-meeting
// @access  Private (Admin)
const scheduleMeeting = asyncHandler(async (req, res) => {
  const { title, date, time, duration, description, agenda, attendees, organizer, meetingType } = req.body;

  // Validate required fields
  if (!title || !date || !time || !attendees || !organizer) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: title, date, time, attendees, organizer'
    });
  }

  try {
    // Create meeting in database first
    const meeting = await Meeting.create({
      title,
      date,
      time,
      duration: duration || 60,
      description: description || '',
      agenda: agenda || '',
      attendees,
      organizer,
      meetingType: meetingType || 'zoom',
      status: 'scheduled'
    });

    // Create Zoom meeting
    const zoomMeetingData = {
      topic: title,
      start_time: `${date}T${time}:00`,
      duration: duration || 60,
      agenda: agenda || '',
      settings: {
        join_before_host: true,
        waiting_room: false,
        host_video: true,
        participant_video: true,
        mute_upon_entry: false,
        watermark: false,
        use_pmi: false,
        approval_type: 0,
        audio: 'both',
        auto_recording: 'none'
      }
    };

    const zoomResponse = await createZoomMeeting(zoomMeetingData);
    
    if (zoomResponse.success) {
      // Update meeting with Zoom details
      meeting.zoomMeetingId = zoomResponse.data.id;
      meeting.zoomJoinUrl = zoomResponse.data.join_url;
      meeting.zoomStartUrl = zoomResponse.data.start_url;
      meeting.zoomPassword = zoomResponse.data.password;
      meeting.meetingLink = zoomResponse.data.join_url;
      
      await meeting.save();

      // Populate attendees for WhatsApp notification
      const populatedMeeting = await Meeting.findById(meeting._id)
        .populate('attendees', 'firstName lastName phone whatsapp')
        .populate('organizer', 'firstName lastName');

      // Send WhatsApp notifications to all attendees
      const notificationPromises = populatedMeeting.attendees.map(attendee => {
        if (attendee.whatsapp || attendee.phone) {
          const message = generateWhatsAppMessage(populatedMeeting, attendee);
          return sendWhatsAppNotification(attendee.whatsapp || attendee.phone, message);
        }
        return Promise.resolve();
      });

      // Wait for all notifications to be sent
      await Promise.allSettled(notificationPromises);

      res.status(201).json({
        success: true,
        message: 'Meeting scheduled successfully',
        meeting: {
          _id: meeting._id,
          title: meeting.title,
          date: meeting.date,
          time: meeting.time,
          duration: meeting.duration,
          description: meeting.description,
          agenda: meeting.agenda,
          meetingType: meeting.meetingType,
          zoomJoinUrl: meeting.zoomJoinUrl,
          zoomStartUrl: meeting.zoomStartUrl,
          zoomPassword: meeting.zoomPassword,
          attendees: meeting.attendees,
          organizer: meeting.organizer
        }
      });
    } else {
      // If Zoom creation fails, delete the meeting and return error
      await Meeting.findByIdAndDelete(meeting._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to create Zoom meeting',
        error: zoomResponse.message
      });
    }
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule meeting',
      error: error.message
    });
  }
});

// @desc    Get all meetings for admin
// @route   GET /api/admin/meetings
// @access  Private (Admin)
const getAdminMeetings = asyncHandler(async (req, res) => {
  try {
    const meetings = await Meeting.find({})
      .populate('attendees', 'firstName lastName email phone')
      .populate('organizer', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: meetings
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meetings',
      error: error.message
    });
  }
});

// @desc    Get meeting by ID
// @route   GET /api/admin/meetings/:id
// @access  Private (Admin)
const getMeetingById = asyncHandler(async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('attendees', 'firstName lastName email phone whatsapp')
      .populate('organizer', 'firstName lastName email');

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    res.json({
      success: true,
      data: meeting
    });
  } catch (error) {
    console.error('Error fetching meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meeting',
      error: error.message
    });
  }
});

// @desc    Update meeting
// @route   PUT /api/admin/meetings/:id
// @access  Private (Admin)
const updateMeeting = asyncHandler(async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Update meeting fields
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        meeting[key] = req.body[key];
      }
    });

    await meeting.save();

    res.json({
      success: true,
      message: 'Meeting updated successfully',
      data: meeting
    });
  } catch (error) {
    console.error('Error updating meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update meeting',
      error: error.message
    });
  }
});

// @desc    Delete meeting
// @route   DELETE /api/admin/meetings/:id
// @access  Private (Admin)
const deleteMeeting = asyncHandler(async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    await Meeting.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Meeting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete meeting',
      error: error.message
    });
  }
});

// Helper function to generate WhatsApp message
const generateWhatsAppMessage = (meeting, attendee) => {
  const date = new Date(meeting.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const time = meeting.time;
  const duration = meeting.duration;
  const agenda = meeting.agenda || 'General discussion';

  return `🎯 *Meeting Invitation - Edurizon*

Hello ${attendee.firstName || 'there'}!

You have been invited to a meeting:

📋 *${meeting.title}*
📅 *Date:* ${date}
⏰ *Time:* ${time}
⏱️ *Duration:* ${duration} minutes
📝 *Agenda:* ${agenda}

🔗 *Join Meeting:* ${meeting.zoomJoinUrl}
🔑 *Password:* ${meeting.zoomPassword || 'No password required'}

Please join the meeting 5 minutes before the scheduled time.

Best regards,
Edurizon Team`;
};

module.exports = {
  scheduleMeeting,
  getAdminMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting
}; 