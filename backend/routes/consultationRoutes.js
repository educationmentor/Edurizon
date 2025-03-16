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
  getConsultationsByEmail
} = require('../controllers/consultationController');

// Public routes
router.post('/request', createConsultationRequest);
router.get('/student', getConsultationsByEmail);

// Counselor routes (protected)
router.get('/pending', protect, getPendingRequests);
router.get('/accepted', protect, getAcceptedRequests);
router.post('/accept/:requestId', protect, acceptRequest);
router.get('/', protect, getConsultations);
router.put('/:consultationId', protect, updateConsultation);

module.exports = router; 