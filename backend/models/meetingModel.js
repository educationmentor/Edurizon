const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 15,
    max: 480 // 8 hours max
  },
  agenda: {
    type: String,
    trim: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser' || 'RegisteredStudent',
    required: true
  }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    required: true
  },
  meetingType: {
    type: String,
    enum: ['zoom', 'google-meet', 'teams', 'other'],
    default: 'zoom'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  zoomMeetingId: {
    type: String
  },
  zoomJoinUrl: {
    type: String
  },
  zoomStartUrl: {
    type: String
  },
  zoomPassword: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better query performance
meetingSchema.index({ date: 1, time: 1 });
meetingSchema.index({ attendees: 1 });
meetingSchema.index({ organizer: 1 });
meetingSchema.index({ status: 1 });

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;