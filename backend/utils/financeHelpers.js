const { RegisteredStudent } = require('../models/registeredUserModel');
const FinanceBill = require('../model/FinanceBill');

/**
 * Calculate remaining processing charge balance for a student
 * Uses financeInfo.processingCharge from registeredUserModel
 * @param {String} studentId - MongoDB ObjectId of the student
 * @returns {Promise<Number>} - Remaining processing charge balance in INR
 */
const calculateRemainingProcessingBalance = async (studentId) => {
  try {
    const student = await RegisteredStudent.findById(studentId);
    
    if (!student || !student.financeInfo) {
      return 0;
    }

    // Use processingCharge from financeInfo (registeredUserModel)
    const totalProcessingInr = student.financeInfo.processingCharge || student.financeInfo.totalProcessingInr || 0;
    
    // Sum all processing fee bills (purpose: 'Processing Fee') that are paid
    const processingBills = await FinanceBill.find({
      studentId: studentId,
      purpose: 'Processing Fee'
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
 * Calculate remaining OTC (One Time Charge) balance for a student
 * Uses financeInfo.oneTimeCharge and financeInfo.oneTimeChargePaid from registeredUserModel
 * @param {String} studentId - MongoDB ObjectId of the student
 * @returns {Promise<Number>} - Remaining OTC balance in USD
 */
const calculateRemainingOtcBalance = async (studentId) => {
  try {
    const student = await RegisteredStudent.findById(studentId);
    
    if (!student || !student.financeInfo) {
      return 0;
    }

    const totalOtc = student.financeInfo.oneTimeCharge || student.financeInfo.totalOtcUsd || 0;
    const otcPaid = student.financeInfo.oneTimeChargePaid || 0;

    const remaining = Math.max(0, totalOtc - otcPaid);
    return roundCurrency(remaining); // Round to 2 decimal places for USD
  } catch (error) {
    console.error('Error calculating remaining OTC balance:', error);
    return 0;
  }
};

/**
 * Get all finance tracking info for a student
 * @param {String} studentId - MongoDB ObjectId of the student
 * @returns {Promise<Object>} - Object containing all finance tracking information
 */
const getFinanceTrackingInfo = async (studentId) => {
  try {
    const student = await RegisteredStudent.findById(studentId);
    
    if (!student || !student.financeInfo) {
      return {
        totalOtcUsd: 0,
        totalProcessingInr: 0,
        otcPaid: 0,
        pendingOtcUsd: 0,
        pendingProcessingInr: 0,
      };
    }

    const totalOtcUsd = student.financeInfo.oneTimeCharge || student.financeInfo.totalOtcUsd || 0;
    const totalProcessingInr = student.financeInfo.processingCharge || student.financeInfo.totalProcessingInr || 0;
    const otcPaid = student.financeInfo.oneTimeChargePaid || 0;

    // Calculate pending amounts
    const pendingOtcUsd = Math.max(0, totalOtcUsd - otcPaid);
    
    // Calculate pending processing from bills
    const processingBills = await FinanceBill.find({
      studentId: studentId,
      purpose: 'Processing Fee'
    });
    const processingPaid = processingBills.reduce((sum, bill) => sum + (bill.amountPaid || 0), 0);
    const pendingProcessingInr = Math.max(0, totalProcessingInr - processingPaid);

    return {
      totalOtcUsd: roundCurrency(totalOtcUsd),
      totalProcessingInr: Math.round(totalProcessingInr * 100) / 100,
      otcPaid: roundCurrency(otcPaid),
      pendingOtcUsd: roundCurrency(pendingOtcUsd),
      pendingProcessingInr: Math.round(pendingProcessingInr * 100) / 100,
      isOtcPaid: pendingOtcUsd <= 0,
    };
  } catch (error) {
    console.error('Error getting finance tracking info:', error);
    return {
      totalOtcUsd: 0,
      totalProcessingInr: 0,
      otcPaid: 0,
      pendingOtcUsd: 0,
      pendingProcessingInr: 0,
      isOtcPaid: false,
    };
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
  calculateRemainingOtcBalance,
  getFinanceTrackingInfo,
  roundCurrency
};


