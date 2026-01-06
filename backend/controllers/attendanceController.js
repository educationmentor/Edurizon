const Attendance = require('../models/attendanceModel');
const AdminUser = require('../models/AdminUser');

// Record attendance when admin logs in
const recordAttendance = async (req, res) => {
  try {
    const { adminId } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const userAgent = req.get('User-Agent');
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Check if attendance already exists for today
    const existingAttendance = await Attendance.findOne({
      adminId,
      date: today,
      isActive: true
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already recorded for today'
      });
    }

    const attendance = new Attendance({
      adminId,
      ipAddress,
      userAgent,
      date: today
    });

    await attendance.save();

    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record attendance',
      error: error.message
    });
  }
};

// Get attendance for a specific admin
const getAdminAttendance = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { adminId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    const attendance = await Attendance.find(query)
      .populate('adminId', 'firstName lastName email role')
      .sort({ loginTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Attendance.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        attendance,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance',
      error: error.message
    });
  }
};

// Get all attendance records (for super admin)
const getAllAttendance = async (req, res) => {
  try {
    const { startDate, endDate, adminId, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    
    if (adminId) {
      query.adminId = adminId;
    }
    
    if (startDate && endDate) {
      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    const attendance = await Attendance.find(query)
      .populate('adminId', 'firstName lastName email role')
      .sort({ loginTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Attendance.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        attendance,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching all attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance',
      error: error.message
    });
  }
};

// Get attendance summary for dashboard
const getAttendanceSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const today = new Date().toISOString().split('T')[0];

    // Build date query
    const dateQuery = {};
    if (startDate && endDate) {
      dateQuery.date = { $gte: startDate, $lte: endDate };
    } else {
      dateQuery.date = today; // Default to today
    }

    // Get total logins for the period
    const totalLogins = await Attendance.countDocuments(dateQuery);

    // Get unique admins who logged in
    const uniqueAdmins = await Attendance.distinct('adminId', dateQuery);

    // Get attendance by admin
    const attendanceByAdmin = await Attendance.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: '$adminId',
          totalLogins: { $sum: 1 },
          firstLogin: { $min: '$loginTime' },
          lastLogin: { $max: '$loginTime' }
        }
      },
      {
        $lookup: {
          from: 'adminusers',
          localField: '_id',
          foreignField: '_id',
          as: 'adminInfo'
        }
      },
      {
        $unwind: '$adminInfo'
      },
      {
        $project: {
          adminId: '$_id',
          firstName: '$adminInfo.firstName',
          lastName: '$adminInfo.lastName',
          email: '$adminInfo.email',
          role: '$adminInfo.role',
          totalLogins: 1,
          firstLogin: 1,
          lastLogin: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalLogins,
        uniqueAdmins: uniqueAdmins.length,
        attendanceByAdmin
      }
    });
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance summary',
      error: error.message
    });
  }
};

// Record logout time
const recordLogout = async (req, res) => {
  try {
    const adminId = req.adminUser._id; // Get adminId from authenticated user
    const today = new Date().toISOString().split('T')[0];

    // Find the active attendance record for today
    const attendance = await Attendance.findOne({
      adminId,
      date: today,
      isActive: true
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'No active attendance record found'
      });
    }

    const logoutTime = new Date();
    const sessionDuration = Math.round((logoutTime - attendance.loginTime) / (1000 * 60)); // in minutes

    attendance.logoutTime = logoutTime;
    attendance.sessionDuration = sessionDuration;
    attendance.isActive = false;

    await attendance.save();

    res.status(200).json({
      success: true,
      message: 'Logout recorded successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Error recording logout:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record logout',
      error: error.message
    });
  }
};

module.exports = {
  recordAttendance,
  getAdminAttendance,
  getAllAttendance,
  getAttendanceSummary,
  recordLogout
};
