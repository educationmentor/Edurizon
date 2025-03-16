const mongoose = require('mongoose');

const consultationRequestSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    interestedCountry: {
      type: String,
      required: true,
    },
    homeCountry: {
      type: String,
      required: true,
    },
    interestedCourse: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'scheduled', 'completed'],
      default: 'pending'
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    meetingTime: {
      type: Date,
    },
    googleMeetLink: {
      type: String,
    },
    notificationSent: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const ConsultationRequest = mongoose.model('ConsultationRequest', consultationRequestSchema);

module.exports = ConsultationRequest; 