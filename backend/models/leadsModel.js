const mongoose = require('mongoose');

const leadsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    countryInterested:{
        type:String,
        required:false,
        default:'None'
    },
    courseName:{
        type:String,
        required:false,
        default:'None'
    },
    leadType:{
        type:String,
        enum: ['pending','follow-up','negative','completed','registered'],
        default: 'pending'
    },
    callingStatus:{
        type:String,
        enum: ['pending','follow-up','no-answer','not-interested'],
        default: 'pending'
    },
    leadStatus:{
        type:String,
        enum: ['hot','warm','negative','cold','pending','completed'],
        default:'pending'
    },
    // Explicit calling date (separate from createdAt/updatedAt)
    callingDate: {
      type: Date,
      required: false,
    },
    // Optional follow-up date for counsellors to schedule callbacks
    followUpDate: {
      type: Date,
      required: false,
    },
    remark:{
        type:String,
        required:false
    },
    assignedCounsellor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'AdminUser'
    },
    assignedCounsellorName:{
        type:String,
        required:false
    },
    source:{
      type:String,
      default:'Website'
    }
  },
  {
    timestamps: true,
  }
);

const Leads = mongoose.model('Leads', leadsSchema);

module.exports = Leads ;