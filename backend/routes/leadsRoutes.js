const express = require('express');
const router = express.Router();
const {
  getAllLeads,
  getLeadById,
  addLead,
  modifyLead,
  deleteLead,
  getLeadsByStatus,
  getLeadsByCounsellor,
  updateLeadStatus,
} = require('../controllers/leadsController');

// Apply authentication middleware to all routes

// @route   GET /api/leads
// @desc    Get all leads
// @access  Private
router.get('/get-all', getAllLeads);

// @route   GET /api/leads/get-all-leads-by-counsellor
// @desc    Get all leads by counsellor
// @access  Private
router.get('/get-all-leads-by-counsellor/:counsellorId', getLeadsByCounsellor);

// @route   GET /api/leads/status/:status
// @desc    Get leads by status
// @access  Private
router.get('/status/:status', getLeadsByStatus);

// @route   GET /api/leads/:id
// @desc    Get single lead by ID
// @access  Private

// @route   POST /api/leads
// @desc    Add a new lead
// @access  Private
router.post('/', addLead);

// @route   PUT /api/leads/:id
// @desc    Update/modify a lead
// @access  Private
router.put('/:id', modifyLead);

// @route   DELETE /api/leads/:id
// @desc    Delete a lead
// @access  Private
router.delete('/:id', deleteLead);

// @route   PATCH /api/leads/:id/update-status
// @desc    Update calling status and category instantly
// @access  Private
router.patch('/:id/update-status', updateLeadStatus);

module.exports = router;
