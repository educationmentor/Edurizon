const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createConsultationRequest,
  getPendingRequests,
  acceptRequest,
  getAcceptedRequests,
  getStudentRequests,
  getConsultations,
  updateConsultation,
  getConsultationsByEmail,
  scheduleMeeting,
  rejectRequest,
  getStudentNotifications
} = require('../controllers/consultationController');
const auth = require('../middleware/auth');

// Public routes
router.post('/request', createConsultationRequest);
router.get('/student', auth, getStudentRequests);
router.get('/notifications', auth, getStudentNotifications);

// Counselor routes (protected)
router.get('/pending', protect, getPendingRequests);
router.get('/accepted', protect, getAcceptedRequests);
router.put('/accept/:requestId', protect, acceptRequest);
router.put('/reject/:requestId', protect, rejectRequest);
router.put('/schedule/:requestId', protect, scheduleMeeting);
router.get('/', protect, getConsultations);
router.put('/:consultationId', protect, updateConsultation);

module.exports = router;