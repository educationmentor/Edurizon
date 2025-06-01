const express = require('express');
const router = express.Router();
const { protectAdminRoute } = require('../middleware/adminAuth');
const {
  getPendingRequests,
  getAcceptedRequests,
  acceptRequest,
  rejectRequest,
  scheduleMeeting,
  deleteRequest,
  getAssignedRequests,
  updateCounsellor
} = require('../controllers/consultationController');

// Admin routes (protected)
router.get('/pending', protectAdminRoute, getPendingRequests);
router.get('/accepted', protectAdminRoute, getAcceptedRequests);
router.put('/accept/:requestId', protectAdminRoute, acceptRequest);
router.put('/reject/:requestId', protectAdminRoute, rejectRequest);
router.put('/schedule/:requestId', protectAdminRoute, scheduleMeeting);
router.delete('/delete/:requestId', protectAdminRoute, deleteRequest);
router.get('/assigned/:counselorId', protectAdminRoute, getAssignedRequests);
router.put('/update-counsellor/:requestId', protectAdminRoute, updateCounsellor);
module.exports = router; 