const express = require('express');
const FinanceBill = require('../model/FinanceBill');
const { RegisteredStudent } = require('../models/registeredUserModel');
const { protectAdminRoute, restrictTo } = require('../middleware/adminAuth');

const router = express.Router();

// Allow both dedicated finance admins and super admins to access finance routes
// Existing finance admin users use the "finance" role in the AdminUser model.
const requireFinanceAdmin = [protectAdminRoute, restrictTo('finance', 'finance-admin', 'super-admin')];

// Helper to determine bill status after payment updates
const resolveBillStatus = (bill) => {
  if (bill.status === 'Cancelled') {
    return 'Cancelled';
  }

  if (bill.amountPaid >= bill.amountDue) {
    return 'Paid';
  }

  if (bill.amountPaid > 0) {
    return 'Partial Payment';
  }

  if (bill.dueDate && bill.dueDate < new Date()) {
    return 'Overdue';
  }

  return 'Pending';
};

// Route 1: Create/Generate New Bill
router.post('/bills', ...requireFinanceAdmin, async (req, res) => {
  try {
    const { studentId, dueDate, description, amountDue } = req.body;

    if (!studentId || !dueDate || !description || amountDue === undefined) {
      return res.status(400).json({
        success: false,
        message: 'studentId, dueDate, description, and amountDue are required',
      });
    }

    const issuedBy = req.adminUser?._id || req.user?.id;
    if (!issuedBy) {
      return res.status(401).json({
        success: false,
        message: 'Unable to determine issuing admin user',
      });
    }

    const bill = await FinanceBill.create({
      studentId,
      dueDate,
      description,
      amountDue,
      issuedBy,
    });

    res.status(201).json({
      success: true,
      data: bill,
    });
  } catch (error) {
    console.error('Error creating finance bill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create finance bill',
    });
  }
});

// Route 2: Get All Bills for Finance Admin
router.get('/bills/all', ...requireFinanceAdmin, async (_req, res) => {
  try {
    const bills = await FinanceBill.find()
      .populate({ path: 'studentId', select: 'name email phone' })
      .populate({ path: 'issuedBy', select: 'name email role' })
      .sort({ issueDate: -1 });

    res.json({
      success: true,
      data: bills,
    });
  } catch (error) {
    console.error('Error fetching finance bills:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch finance bills',
    });
  }
});

// Route 3: Get Pending Bills List
router.get('/bills/pending', ...requireFinanceAdmin, async (_req, res) => {
  try {
    const bills = await FinanceBill.find({
      status: { $in: ['Pending', 'Partial Payment', 'Overdue'] },
    })
      .populate({ path: 'studentId', select: 'name email phone' })
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      data: bills,
    });
  } catch (error) {
    console.error('Error fetching pending bills:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending bills',
    });
  }
});

// Route 4: Get Bills by Student
router.get('/bills/student/:studentId', ...requireFinanceAdmin, async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'studentId param is required',
      });
    }

    const bills = await FinanceBill.find({ studentId }).sort({ issueDate: -1 });

    res.json({
      success: true,
      data: bills,
    });
  } catch (error) {
    console.error('Error fetching bills for student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student bills',
    });
  }
});

// Route 5: Record Payment
router.patch('/bills/:billId/payment', ...requireFinanceAdmin, async (req, res) => {
  try {
    const { billId } = req.params;
    const { amount, method } = req.body;

    if (!billId) {
      return res.status(400).json({
        success: false,
        message: 'billId param is required',
      });
    }

    if (amount === undefined || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must be greater than zero',
      });
    }

    const bill = await FinanceBill.findById(billId);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Finance bill not found',
      });
    }

    bill.paymentRecords.push({
      amount,
      method,
    });

    bill.amountPaid += amount;
    bill.status = resolveBillStatus(bill);

    await bill.save();

    res.json({
      success: true,
      data: bill,
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment',
    });
  }
});

// Route 6: Get List of All Students
router.get('/students/all', ...requireFinanceAdmin, async (_req, res) => {
  try {
    const students = await RegisteredStudent.find({}, 'name email phone').sort({ name: 1 });

    res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
    });
  }
});

module.exports = router;


