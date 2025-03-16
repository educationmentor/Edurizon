const asyncHandler = require('express-async-handler');
const ConsultationRequest = require('../models/consultationRequestModel');
const { generateMeetLink } = require('../utils/googleMeet');
const Consultation = require('../models/consultationModel');
const User = require('../models/userModel');

// @desc    Create a new consultation request
// @route   POST /api/consultation/request
// @access  Public
const createConsultationRequest = asyncHandler(async (req, res) => {
  const { name, email, phone, interestedCountry, homeCountry, interestedCourse } = req.body;

  if (!name || !email || !phone || !interestedCountry || !homeCountry || !interestedCourse) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const request = await ConsultationRequest.create({
    name,
    email,
    phone,
    interestedCountry,
    homeCountry,
    interestedCourse,
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    data: request
  });
});

// @desc    Get all pending consultation requests
// @route   GET /api/consultation/pending
// @access  Private (Counselor only)
const getPendingRequests = asyncHandler(async (req, res) => {
  const requests = await ConsultationRequest.find({ status: 'pending' })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: requests
  });
});

// @desc    Accept a consultation request
// @route   POST /api/consultation/accept/:requestId
// @access  Private (Counselor only)
const acceptRequest = asyncHandler(async (req, res) => {
  const request = await ConsultationRequest.findById(req.params.requestId);

  if (!request) {
    res.status(404);
    throw new Error('Consultation request not found');
  }

  if (request.status !== 'pending') {
    res.status(400);
    throw new Error('This request has already been accepted');
  }

  // Generate Google Meet link
  const meetLink = await generateMeetLink(request.name);

  request.status = 'accepted';
  request.acceptedBy = req.user._id;
  request.googleMeetLink = meetLink;
  await request.save();

  res.json({
    success: true,
    data: request
  });
});

// @desc    Get accepted consultation requests for a counselor
// @route   GET /api/consultation/accepted
// @access  Private (Counselor only)
const getAcceptedRequests = asyncHandler(async (req, res) => {
  const requests = await ConsultationRequest.find({
    status: 'accepted',
    acceptedBy: req.user._id
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: requests
  });
});

// @desc    Get consultation requests for a student
// @route   GET /api/consultation/student
// @access  Public
const getStudentRequests = asyncHandler(async (req, res) => {
  const { email } = req.query;

  if (!email) {
    res.status(400);
    throw new Error('Please provide student email');
  }

  const requests = await ConsultationRequest.find({ email })
    .populate('acceptedBy', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: requests
  });
});

// Create a new consultation request
const createConsultation = asyncHandler(async (req, res) => {
  const { name, email, phone, preferredDate, preferredTime, message } = req.body;

  // Create new consultation request
  const consultation = await Consultation.create({
    name,
    email,
    phone,
    preferredDate,
    preferredTime,
    message
  });

  // Find available counselors and notify them (this can be expanded later)
  const counselors = await User.find({ role: 'counselor' });
  
  // Here you can add notification logic for counselors
  // For now, we'll just return success

  res.status(201).json({
    success: true,
    message: 'Consultation request created successfully',
    data: consultation
  });
});

// Get all consultation requests (for counselors)
const getConsultations = asyncHandler(async (req, res) => {
  const consultations = await Consultation.find()
    .sort({ createdAt: -1 })
    .populate('counselor', 'name email');

  res.status(200).json({
    success: true,
    data: consultations
  });
});

// Update consultation status (for counselors)
const updateConsultation = asyncHandler(async (req, res) => {
  const { consultationId } = req.params;
  const { status, counselorId } = req.body;

  const consultation = await Consultation.findByIdAndUpdate(
    consultationId,
    {
      status,
      counselor: counselorId,
      ...(status === 'accepted' && { acceptedAt: Date.now() })
    },
    { new: true }
  ).populate('counselor', 'name email');

  if (!consultation) {
    return res.status(404).json({
      success: false,
      message: 'Consultation not found'
    });
  }

  res.status(200).json({
    success: true,
    data: consultation
  });
});

// Get consultations by email (for students)
const getConsultationsByEmail = asyncHandler(async (req, res) => {
  const { email } = req.query;

  const consultations = await Consultation.find({ email })
    .sort({ createdAt: -1 })
    .populate('counselor', 'name email');

  res.status(200).json({
    success: true,
    data: consultations
  });
});

module.exports = {
  createConsultationRequest,
  getPendingRequests,
  acceptRequest,
  getAcceptedRequests,
  getStudentRequests,
  createConsultation,
  getConsultations,
  updateConsultation,
  getConsultationsByEmail
}; 