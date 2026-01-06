const express = require('express');
const router = express.Router();
const {
  getAllUniversities,
  getUniversityById,
  getUniversitiesByCountry,
  addUniversity,
  updateUniversity,
  deleteUniversity,
  getUniversitiesStats
} = require('../controllers/partneredUniversitiesController');

// Public routes (no authentication required)
// @route   GET /api/partnered-universities
// @desc    Get all partnered universities
// @access  Public
router.get('/', getAllUniversities);

// @route   GET /api/partnered-universities/stats/overview
// @desc    Get universities statistics overview
// @access  Public
router.get('/stats/overview', getUniversitiesStats);

// @route   GET /api/partnered-universities/country/:country
// @desc    Get universities by country
// @access  Public
router.get('/country/:country', getUniversitiesByCountry);

// @route   GET /api/partnered-universities/:id
// @desc    Get single university by ID
// @access  Public
router.get('/:id', getUniversityById);

// Protected routes (admin authentication required)
// Note: You can add admin authentication middleware here if needed
// @route   POST /api/partnered-universities
// @desc    Add a new partnered university
// @access  Private (Admin only)
router.post('/', addUniversity);

// @route   PUT /api/partnered-universities/:id
// @desc    Update a partnered university
// @access  Private (Admin only)
router.put('/:id', updateUniversity);

// @route   DELETE /api/partnered-universities/:id
// @desc    Delete a partnered university
// @access  Private (Admin only)
router.delete('/:id', deleteUniversity);

module.exports = router;
