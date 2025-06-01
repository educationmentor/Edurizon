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
    status: {
      type: String,
      enum: ['pending', 'assigned', 'completed'],
      default: 'pending'
    },
    counsellingStatus:{
      type:String,
      enum:['pending','completed'],
      default:'pending'
    },
    typeofLead:{
      type:String,
      enum:['warm','cold','hot'],
      default:'cold'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
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