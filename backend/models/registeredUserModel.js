const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    // Personal Details
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
      unique: true, // Each phone number must be unique
    },
    password: {
      type: String,
      required: false,
    },
    dob: {
      type: Date,
      required: false,
    },
    address: {
        type: String,
        required: false,
    },
    
    // Documents
    documents: {
      type: Map,
      of: String,
      required: false,
    },

    // Academic Preferences
    studyDestination: {
      type: String,
      required: true,
    },
    intendedCourse: {
        type: String,
        required: true,
    },
    preferedUniversity:{
      type:String,
      required: false,
      default: 'None'
    },
    assignedCounselor: {
      type: String,
      required: false,
    },
    scholarshipApplied:{
      type:String,
      required:false,
      default:'None'
    },
    // Process Tracking
    applicationStage:{
        type: String,
        enum: ['Consultation', 'Document Upload', 'Document Verification', 'Selected University Application', 'Offer Letter', 'Visa Approval', 'Departure'],
        required: true,
        default: 'Consultation'
    },
    // Account Details
    lastLoginDate: {
      type: Date,
      required: false,
      default: Date.now,
    },
    accountStatus: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        required: true,
        default: 'active',
    },
    notes:{
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const RegisteredStudent = mongoose.model('RegisteredStudent', userSchema);

module.exports = { RegisteredStudent };