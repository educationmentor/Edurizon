const { AdminUser } = require("../models/AdminUser");
const getAllCounsellors = async (req, res) => {
    try {
      const counsellors = await AdminUser.find({ role: { $in: ['super-admin', 'counsellor'] } })
      .select('-password'); // exclude password
        res.status(200).json({
          success: true,
          data: counsellors
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to fetch counsellors",
          error: error.message
        });
      }
}

module.exports = {
    getAllCounsellors
}