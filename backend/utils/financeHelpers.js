const { RegisteredStudent } = require('../models/registeredUserModel');
const FinanceBill = require('../model/FinanceBill');

/**
 * Calculate remaining processing charge balance for a student
 * @param {String} studentId - MongoDB ObjectId of the student
 * @returns {Promise<Number>} - Remaining processing charge balance in INR
 */
const calculateRemainingProcessingBalance = async (studentId) => {
  try {
    const student = await RegisteredStudent.findById(studentId);
    
    if (!student || !student.financeInfo) {
      return 0;
    }

    const totalProcessingInr = student.financeInfo.totalProcessingInr || 0;
    
    // Sum all processing fee bills (INR currency) that are paid
    const processingBills = await FinanceBill.find({
      studentId: studentId,
      currency: 'INR',
      purpose: { $regex: /processing/i } // Match "Processing Fee", "Partial Processing Fee", etc.
    });

    const totalPaid = processingBills.reduce((sum, bill) => {
      return sum + (bill.amountPaid || 0);
    }, 0);

    const remaining = Math.max(0, totalProcessingInr - totalPaid);
    return Math.round(remaining * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error('Error calculating remaining processing balance:', error);
    return 0;
  }
};

/**
 * Round currency amount to 2 decimal places (for USD)
 * @param {Number} amount - Amount to round
 * @returns {Number} - Rounded amount
 */
const roundCurrency = (amount) => {
  return Math.round(amount * 100) / 100;
};

module.exports = {
  calculateRemainingProcessingBalance,
  roundCurrency
};


