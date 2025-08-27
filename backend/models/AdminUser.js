const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = {
  SUPER_ADMIN: 'super-admin',
  COUNSELLOR: 'counsellor',
  DOCUMENT_HANDLER: 'documentHandler',
  FINANCE: 'finance',
  DIGITAL_MARKETING: 'digitalMarketing',
  COUNSELLOR_ADMIN: 'counsellorAdmin'
};

const videoSchema = new mongoose.Schema({
  videoName: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfShoot: {
    type: Date,
    required: false,
  },
  videoEdited: {
    type: Boolean,
    default: false,
  },
  thumbnailUploaded: {
    type: Boolean,
    default: false,
  },
  captionAdded: {
    type: Boolean,
    default: false,
  },
  videoUploaded: {
    type: Boolean,
    default: false,
  },
  platform: {
    type: [String], // e.g. ["YouTube", "Instagram", "Facebook"]
    default: [],
  },
  uploadDate: {
    type: Date,
  },
  description: {
    type: String,
    trim: true,
  }
}, { _id: true,
  timestamps: true,
 }); // no extra _id for subdocs



const adminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
  },
  contactNo: {
    type: String,
    required: false,
    trim: true,
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    required: [true, 'Role is required'],
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  country: {
    type: [String],
    required: false,
    trim: true,
  },
  studentId:{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: false,
  },
  
   digitalMarketingVideos: {
    type: [videoSchema],
    required: function () {
      return this.role === ROLES.DIGITAL_MARKETING;
    },
    default: [],
  },

  // Account Information
  active: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true,
});

// Pre-save middleware to hash password
adminUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
adminUserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if password was changed after token was issued
adminUserSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Static method to get available roles
adminUserSchema.statics.getRoles = function() {
  return ROLES;
};

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = {
  AdminUser,
  ROLES
}; 