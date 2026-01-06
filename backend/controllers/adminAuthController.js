const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { AdminUser, ROLES } = require('../models/AdminUser');
const config = require('../config/config');
const sendEmail = require('../utils/email');
const mongoose = require('mongoose');
const Attendance = require('../models/attendanceModel');

// Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, config.jwt.adminSecret, {
    expiresIn: config.jwt.expiresIn
  });
};

// Send JWT Token Response
const createSendToken = (adminUser, statusCode, res) => {
  const token = signToken(adminUser._id);

  // Remove password from output
  adminUser.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: adminUser
    }
  });
};

// Register new admin user (Super Admin only)
exports.register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      firstName,
      lastName,
      country,
      contactNo
    } = req.body;

    // Check if user already exists
    const existingUser = await AdminUser.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email or username already exists'
      });
    }

    // Create new admin user
    const newAdmin = await AdminUser.create({
      username,
      email,
      password,
      role,
      firstName,
      lastName,
      country,
      contactNo
    });

    createSendToken(newAdmin, 201, res);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Login admin user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists && password is correct
    const adminUser = await AdminUser.findOne({ email }).select('+password');
    if (!adminUser || !(await adminUser.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    // Check if user is active
    if (!adminUser.active) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact the super admin.'
      });
    }

    // Update last login
    adminUser.lastLogin = Date.now();
    await adminUser.save({ validateBeforeSave: false });

    // Record attendance
    try {
      const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
      const userAgent = req.get('User-Agent');
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      // Check if attendance already exists for today
      const existingAttendance = await Attendance.findOne({
        adminId: adminUser._id,
        date: today,
        isActive: true
      });

      if (!existingAttendance) {
        const attendance = new Attendance({
          adminId: adminUser._id,
          ipAddress,
          userAgent,
          date: today
        });
        await attendance.save();
      }
    } catch (attendanceError) {
      console.error('Error recording attendance:', attendanceError);
      // Don't fail login if attendance recording fails
    }

    // Generate token
    const token = signToken(adminUser._id);

    // Remove password from output
    adminUser.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: adminUser
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const adminUser = await AdminUser.findOne({ email: req.body.email });
    if (!adminUser) {
      return res.status(404).json({
        status: 'error',
        message: 'There is no user with this email address'
      });
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    adminUser.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    adminUser.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await adminUser.save({ validateBeforeSave: false });

    // Send reset token email
    const resetURL = `${config.frontendUrl}/admin/reset-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: adminUser.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      adminUser.passwordResetToken = undefined;
      adminUser.passwordResetExpires = undefined;
      await adminUser.save({ validateBeforeSave: false });

      return res.status(500).json({
        status: 'error',
        message: 'There was an error sending the email. Try again later!'
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    // Get user based on token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const adminUser = await AdminUser.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // If token has not expired, and there is user, set the new password
    if (!adminUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Token is invalid or has expired'
      });
    }

    adminUser.password = req.body.password;
    adminUser.passwordResetToken = undefined;
    adminUser.passwordResetExpires = undefined;
    adminUser.passwordChangedAt = Date.now();
    await adminUser.save();

    createSendToken(adminUser, 200, res);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update Password
exports.updatePassword = async (req, res) => {
  try {
    const adminUser = await AdminUser.findById(req.adminUser.id).select('+password');

    // Check if current password is correct
    if (!(await adminUser.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({
        status: 'error',
        message: 'Your current password is wrong'
      });
    }

    // Update password
    adminUser.password = req.body.newPassword;
    adminUser.passwordChangedAt = Date.now();
    await adminUser.save();

    createSendToken(adminUser, 200, res);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get available roles
exports.getRoles = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      roles: ROLES
    }
  });
};

// Get current logged-in admin (from token)
exports.getCurrentAdmin = async (req, res) => {
  try {
    if (!req.adminUser) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated'
      });
    }

    // Fresh fetch to ensure latest data from DB (including videos)
    const freshAdmin = await AdminUser.findById(req.adminUser._id);
    if (!freshAdmin) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: freshAdmin
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Validate Token
exports.validateToken = async (req, res) => {
  // If the request reaches here, it means the token is valid
  // (protectAdminRoute middleware has already validated it)
  res.status(200).json({
    status: 'success',
    message: 'Token is valid'
  });
}; 


// Function to Create Token for loging as superadmin
exports.impersonate=async (req, res) => {
  // if (req.user.role !== "super-admin") {
  //   return res.status(403).json({ message: "Unauthorized" });
  // }

  const user = await AdminUser.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // create token as if Parthiv logged in
  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    config.jwt.adminSecret,
    { expiresIn: config.jwt.expiresIn || '1h' }
  );

  res.json({ token, user });
}


// Function to add video data for digital Team 
exports.addVideoData=async(req,res)=>{
  try {
    const { id } = req.params; // pass userId in route
    const {
      videoName,
      dateOfShoot,
      videoEdited,
      thumbnailUploaded,
      captionAdded,
      videoUploaded,
      platform,
      uploadDate,
      description
    } = req.body;
    // Video object to add
    const newVideo = {
      videoName,
      dateOfShoot,
      videoEdited: videoEdited || false,
      thumbnailUploaded: thumbnailUploaded || false,
      captionAdded: captionAdded || false,
      videoUploaded: videoUploaded || false,
      platform: platform || [],
      uploadDate,
      description,
    };

    // Push video into user's digitalMarketingVideos
    const updatedUser = await AdminUser.findByIdAndUpdate(
      id,
      { $push: { digitalMarketingVideos: newVideo } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Video added successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateVideoData=async(req,res)=>{
  try {
    const { id } = req.params;
    const { videoId, ...data } = req.body;
    
    // Find the user and update the specific video field
    const updatedUser = await AdminUser.findOneAndUpdate(
      { 
        _id: id, 
        'digitalMarketingVideos._id': videoId 
      },
      { 
        $set: { 
          [`digitalMarketingVideos.$.${Object.keys(data)[0]}`]: Object.values(data)[0]
        } 
      },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User or video not found" });
    }

    // Find the updated video
    const updatedVideo = updatedUser.digitalMarketingVideos.find(
      video => video._id.toString() === videoId
    );

    res.status(200).json({ 
      message: "Video updated successfully", 
      video: updatedVideo 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

exports.deleteVideoData=async(req,res)=>{
  try {
    const { id } = req.params;
    const { videoId } = req.body;
    const updatedUser = await AdminUser.findOneAndUpdate(
      { _id: id },
      { $pull: { digitalMarketingVideos: { _id: videoId } } },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "Video deleted successfully", user: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

// Function to update individual video field for instant updates
exports.updateVideoField = async (req, res) => {
  try {
    const { userId } = req.params;
    const { videoId, field, value } = req.body;

    // Find the user and update the specific field of the specific video
    const updatedUser = await AdminUser.findOneAndUpdate(
      { 
        _id: userId, 
        'digitalMarketingVideos._id': videoId 
      },
      { 
        $set: { 
          [`digitalMarketingVideos.$.${field}`]: value 
        } 
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User or video not found" });
    }

    // Find the updated video
    const updatedVideo = updatedUser.digitalMarketingVideos.find(
      video => video._id.toString() === videoId
    );

    res.status(200).json({ 
      message: "Video field updated successfully", 
      video: updatedVideo 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to get all admin users for meeting scheduling
exports.getAllAdminUsers = async (req, res) => {
  try {
    const users = await AdminUser.find({}, {
      _id: 1,
      firstName: 1,
      lastName: 1,
      username: 1,
      email: 1,
      role: 1
    }).sort({ firstName: 1, lastName: 1 });

    res.status(200).json({
      status: 'success',
      data: users
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Function to schedule a meeting
exports.scheduleMeeting = async (req, res) => {
  try {
    const {
      title,
      date,
      time,
      duration,
      description,
      agenda,
      attendees,
      organizer,
      meetingType
    } = req.body;

    // Validate required fields
    if (!title || !date || !time || !duration || !attendees || !organizer) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Validate attendees array
    if (!Array.isArray(attendees) || attendees.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one attendee is required"
      });
    }

    // Check if organizer exists
    const organizerExists = await AdminUser.findById(organizer);
    if (!organizerExists) {
      return res.status(404).json({
        success: false,
        message: "Organizer not found"
      });
    }

    // Check if all attendees exist - Fixed ObjectId constructor
    const attendeeIds = attendees.map(id => new mongoose.Types.ObjectId(id));
    const existingAttendees = await AdminUser.find({
      _id: { $in: attendeeIds }
    });

    if (existingAttendees.length !== attendees.length) {
      return res.status(404).json({
        success: false,
        message: "One or more attendees not found"
      });
    }

    // Create new meeting
    const Meeting = require('../models/meetingModel');
    const meeting = new Meeting({
      title,
      date,
      time,
      duration,
      description,
      agenda,
      attendees,
      organizer,
      meetingType: meetingType || 'zoom'
    });

    // Generate Zoom meeting if meetingType is 'zoom'
    if (meetingType === 'zoom' || meetingType === undefined) {
      try {
        const { createZoomMeeting } = require('../utils/zoomApi');
        
        // Combine date and time for Zoom API
        const startTime = new Date(`${date}T${time}`);
        const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
        
        const zoomMeetingData = {
          title: title,
          startTime: startTime.toISOString(),
          duration: duration
        };

        const zoomResult = await createZoomMeeting(zoomMeetingData);
        
        if (zoomResult.success) {
          meeting.zoomMeetingId = zoomResult.meetingId;
          meeting.zoomJoinUrl = zoomResult.joinUrl;
          meeting.zoomStartUrl = zoomResult.startUrl;
          meeting.zoomPassword = zoomResult.password;
          meeting.meetingLink = zoomResult.joinUrl; // Set the main meeting link
        }
      } catch (zoomError) {
        console.error('Failed to create Zoom meeting:', zoomError);
        // Continue with meeting creation even if Zoom fails
        meeting.meetingType = 'other';
      }
    }

    await meeting.save();

    // Populate attendee and organizer details for response
    await meeting.populate([
      { path: 'attendees', select: 'firstName lastName username email role' },
      { path: 'organizer', select: 'firstName lastName username email role' }
    ]);

    // Send email notifications if Zoom meeting was created successfully
    if (meeting.zoomJoinUrl) {
      try {
        const { sendZoomMeetingNotification } = require('../utils/email');
        
        // Send notification to organizer
        const organizerEmail = meeting.organizer.email;
        await sendZoomMeetingNotification(organizerEmail, meeting, true);
        
        // Send notifications to all attendees
        for (const attendee of meeting.attendees) {
          if (attendee.email !== organizerEmail) { // Don't send duplicate to organizer
            await sendZoomMeetingNotification(attendee.email, meeting, false);
          }
        }
        
      } catch (emailError) {
        console.error('Failed to send Zoom meeting notifications:', emailError);
        // Continue with response even if emails fail
      }
    }

    res.status(201).json({
      success: true,
      message: "Meeting scheduled successfully",
      meeting
    });

  } catch (error) {
    console.error('Error scheduling meeting:', error);
    res.status(500).json({
      success: false,
      message: "Failed to schedule meeting",
      error: error.message
    });
  }
};

// Function to get all digital marketing videos from all admins
exports.getAllDigitalVideos = async (req, res) => {
  try {
    // Find all admin users with digitalMarketing role
    const digitalAdmins = await AdminUser.find({ role: 'digitalMarketing' });
    
    let allVideos = [];
    
    // Collect all videos from each admin and add admin information
    digitalAdmins.forEach(admin => {
      if (admin.digitalMarketingVideos && admin.digitalMarketingVideos.length > 0) {
        const videosWithAdminInfo = admin.digitalMarketingVideos.map(video => ({
          ...video.toObject(),
          adminName: admin.firstName && admin.lastName 
            ? `${admin.firstName} ${admin.lastName}` 
            : admin.username || admin.email,
          adminId: admin._id,
          adminEmail: admin.email
        }));
        allVideos.push(...videosWithAdminInfo);
      }
    });

    // Sort by creation date (newest first)
    allVideos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.status(200).json({
      success: true,
      count: allVideos.length,
      videos: allVideos
    });

  } catch (error) {
    console.error('Error fetching all digital videos:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};