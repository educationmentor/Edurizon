const PDFDocument = require('pdfkit');
const path = require('path');
const { RegisteredStudent } = require('../models/registeredUserModel');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { calculateRemainingProcessingBalance, roundCurrency } = require('../utils/financeHelpers');
const FinanceBill = require('../model/FinanceBill');

const feeStructure = async (req, res) => {
  try {
    const {
      studentId,
      fatherName,
      countryName,
      universities,
      programme,
      oneTimeCharge,
      processingCharge,
      ticketsIncluded,
      visasIncluded,
      firstYearPackageIncluded,
    } = req.body;

    // Validate required fields
    if (!studentId || !fatherName || !countryName || !programme || 
        oneTimeCharge === undefined || processingCharge === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: studentId, fatherName, countryName, programme, oneTimeCharge, processingCharge are required',
      });
    }

    // Fetch student details
    const student = await RegisteredStudent.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 0, bottom: 0, left: 50, right: 50 },
    });

    // Create a buffer to store PDF
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', async () => {
      try {
        const pdfBuffer = Buffer.concat(chunks);

        // Upload PDF to Cloudinary (ensure it's saved as PDF)
        const timestamp = Date.now();
        const publicId = `fee-structure-${student._id}-${timestamp}.pdf`;
        
        // Upload as raw file (PDF) to preserve format
        // Include .pdf in public_id to ensure proper file type
        const cloudinaryResult = await uploadToCloudinary(
          pdfBuffer,
          'edurizon/fee-structures',
        );

        console.log('PDF uploaded to Cloudinary:', cloudinaryResult.secure_url);
        console.log('Resource type:', cloudinaryResult.resource_type);
        console.log('Format:', cloudinaryResult.format);
        console.log('Public ID:', cloudinaryResult.public_id);

        // Update student's feeStructure field, set generation date, and reset agreement
        student.feeStructure = cloudinaryResult.secure_url;
        student.feeStructureGeneratedDate = new Date();
        student.feeStructureAgreed = false;

        // Update financeInfo with structured data
        if (!student.financeInfo) {
          student.financeInfo = {};
        }
        student.financeInfo.feeStructureLink = cloudinaryResult.secure_url;
        student.financeInfo.totalOtcUsd = roundCurrency(Number(oneTimeCharge) || 0);
        student.financeInfo.totalProcessingInr = Math.round((Number(processingCharge) || 0) * 100) / 100;
        student.financeInfo.isOtcPaid = false; // OTC is not paid initially
        student.financeInfo.inclusions = {
          visa: visasIncluded || false,
          flightTickets: ticketsIncluded || false,
          firstYearPackage: firstYearPackageIncluded || false,
        };
        // Initialize bills array if it doesn't exist
        if (!student.financeInfo.bills) {
          student.financeInfo.bills = [];
        }

        await student.save();

        // Send notification to student about fee structure generation
        const mongoose = require('mongoose');
        const notificationPayload = {
          _id: new mongoose.Types.ObjectId(),
          message: `Your fee structure has been generated. Please review and agree to the terms.`,
          sentAt: new Date(),
          isRead: false,
          senderId: req.adminUser?._id?.toString() || 'system',
        };
        
        await RegisteredStudent.findByIdAndUpdate(
          studentId,
          { $push: { notifications: notificationPayload } },
          { new: false }
        );

        res.status(200).json({
          success: true,
          message: 'Fee structure generated and uploaded successfully',
          data: {
            feeStructureUrl: cloudinaryResult.secure_url,
            studentId: student._id,
            studentName: student.name,
          },
        });
      } catch (error) {
        console.error('Error uploading PDF to Cloudinary:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to upload fee structure PDF',
          error: error.message,
        });
      }
    });

    // PDF Content
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = 50;
    const contentWidth = pageWidth - 2 * margin;

    // Header Image
    const headerImagePath = path.join(__dirname, '../assets/header.jpg');
    try {
      const headerHeight = 120;
      doc.image(headerImagePath, 0, 0, { width: pageWidth, height: headerHeight });
    } catch (error) {
      console.error('Error loading header image:', error);
      // Fallback to text header if image fails
      doc.fontSize(24)
         .font('Times-Bold')
         .text('EDURIZON', margin, 50, { align: 'center' });
    }

    let yPosition = 140;

    // Title
    doc.fontSize(18)
       .font('Times-Bold')
       .text('FEE STRUCTURE', margin, yPosition, { align: 'center' });

    yPosition += 40;

    // Date - Above Student Information
    const generationDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.fontSize(10)
       .font('Times-Roman')
       .text(`Date: ${generationDate}`, margin, yPosition, { align: 'right' });

    yPosition += 25;

    // Two Column Layout for Student and Academic Information
    const col1Start = margin;
    const col2Start = margin + (contentWidth / 2) + 20;
    const colWidth = (contentWidth / 2) - 20;

    // Student Information Section (Left Column)
    doc.fontSize(14)
       .font('Times-Bold')
       .text('Student Information', col1Start, yPosition);
    
    let leftY = yPosition + 25;
    doc.fontSize(11)
       .font('Times-Roman')
       .text(`Student Name: ${student.name}`, col1Start, leftY, { width: colWidth });
    
    leftY += 18;
    doc.text(`Father's Name: ${fatherName}`, col1Start, leftY, { width: colWidth });
    
    leftY += 18;
    doc.text(`Email: ${student.email || 'N/A'}`, col1Start, leftY, { width: colWidth });
    
    leftY += 18;
    doc.text(`Phone: ${student.phone || 'N/A'}`, col1Start, leftY, { width: colWidth });
    
    leftY += 18;
    // Handle multiple countries (comma separated)
    const countriesList = countryName ? countryName.split(',').map(c => c.trim()).filter(c => c) : [];
    const countriesText = countriesList.length > 0 ? countriesList.join(', ') : countryName;
    doc.text(`Country: ${countriesText}`, col1Start, leftY, { width: colWidth });

    // Academic Information Section (Right Column)
    doc.fontSize(14)
       .font('Times-Bold')
       .text('Academic Information', col2Start, yPosition);
    
    let rightY = yPosition + 25;
    doc.fontSize(11)
       .font('Times-Roman')
       .text(`Programme: ${programme}`, col2Start, rightY, { width: colWidth });
    
    rightY += 18;
    if (universities && universities.length > 0) {
      const universitiesText = Array.isArray(universities) 
        ? universities.join('\n') 
        : universities;
      // Handle multiple universities - split and display each on a new line if needed
      const universitiesList = Array.isArray(universities) ? universities : [universities];
      doc.text('Universities:', col2Start, rightY, { width: colWidth });
      rightY += 15;
      universitiesList.forEach((uni, index) => {
        if (index < 3) { // Limit to 3 universities as requested
          doc.text(`${index + 1}. ${uni}`, col2Start, rightY, { width: colWidth });
          rightY += 15;
        }
      });
    }

    // Use the maximum Y position from both columns
    yPosition = Math.max(leftY, rightY) + 30;

    // Fee Structure Section
    doc.fontSize(14)
       .font('Times-Bold')
       .text('Fee Structure', margin, yPosition);
    
    yPosition += 30;

    // Fee Details Table
    const tableTop = yPosition;
    const itemHeight = 25;
    const col1 = margin;
    const col2 = margin + contentWidth - 150;

    // Table Header
    doc.fontSize(11)
       .font('Times-Bold')
       .text('Description', col1, tableTop)
       .text('Amount', col2, tableTop, { align: 'right' });

    yPosition = tableTop + itemHeight;
    doc.moveTo(margin, yPosition - 5)
       .lineTo(pageWidth - margin, yPosition - 5)
       .stroke();

    // One Time Charge
    doc.fontSize(11)
       .font('Times-Roman')
       .text('One Time Charge (USD)', col1, yPosition)
       .text(`$${Number(oneTimeCharge).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, col2, yPosition, { align: 'right' });
    
    yPosition += itemHeight;

    // Processing Charge
    doc.text('Processing Charge (INR)', col1, yPosition)
       .text(`INR ${Number(processingCharge).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, col2, yPosition, { align: 'right' });
    
    yPosition += itemHeight;

    // Additional Services
    if (ticketsIncluded) {
      doc.text('Flight Tickets (Included)', col1, yPosition)
         .text('Included', col2, yPosition, { align: 'right' });
      yPosition += itemHeight;
    }

    if (visasIncluded) {
      doc.text('Visa Charges (Included)', col1, yPosition)
         .text('Included', col2, yPosition, { align: 'right' });
      yPosition += itemHeight;
    }

    if (firstYearPackageIncluded) {
      doc.text('First Year Package (Included)', col1, yPosition)
         .text('Included', col2, yPosition, { align: 'right' });
      yPosition += itemHeight;
    }

    yPosition += 30;

    // Important Notes Section
    doc.fontSize(12)
       .font('Times-Bold')
       .text('Please Note:', margin, yPosition);
    
    yPosition += 20;
    doc.fontSize(10)
       .font('Times-Roman')
       .text('1. NEET qualification is mandatory.', margin + 10, yPosition, { width: contentWidth - 10 });
    
    yPosition += 15;
    const note2Text = '2. Final admission shall be strictly subject to the successful clearance of the entrance examination/interview, as and when conducted.';
    const note2Height = doc.heightOfString(note2Text, { width: contentWidth - 10 });
    doc.text(note2Text, margin + 10, yPosition, { width: contentWidth - 10 });
    
    yPosition += note2Height + 10;
    doc.text('3. All the amount is non-refundable.', margin + 10, yPosition, { width: contentWidth - 10 });

    yPosition += 40;

    // Footer Image - Position at bottom of page
    const footerImagePath = path.join(__dirname, '../assets/footer.png');
    const footerHeight = 150;
    const footerY = pageHeight - footerHeight;
    
    // Only add footer if there's enough space, otherwise it will be on next page
    if (yPosition < footerY - 20) {
      try {
        doc.image(footerImagePath, 0, footerY, { width: pageWidth, height: footerHeight });
      } catch (error) {
        console.error('Error loading footer image:', error);
        // Fallback to text footer if image fails
        doc.fontSize(10)
           .font('Times-Roman')
           .text('This is a system-generated fee structure document.', margin, footerY + 30, { align: 'center' });
      }
    } else {
      // Content is too long, add footer on current position
      try {
        doc.image(footerImagePath, 0, yPosition, { width: pageWidth, height: footerHeight });
      } catch (error) {
        console.error('Error loading footer image:', error);
        // Fallback to text footer if image fails
        doc.fontSize(10)
           .font('Times-Roman')
           .text('This is a system-generated fee structure document.', margin, yPosition + 30, { align: 'center' });
      }
    }

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('Error generating fee structure:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate fee structure',
      error: error.message,
    });
  }
};

const billStructure = async (req, res) => {
  try {
    const {
      studentId,
      paymentAmount,
      paymentNumber,
      studentName,
      university,
      status,
      currency = 'INR',
      purpose,
      fatherName,
      programme
    } = req.body;

    // Validate required fields
    if (!studentId || !paymentAmount || !studentName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: studentId, paymentAmount, and studentName are required',
      });
    }

    // Fetch student details
    const student = await RegisteredStudent.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Get finance info
    const financeInfo = student.financeInfo || {};
    const totalOtcUsd = financeInfo.totalOtcUsd || 0;
    const totalProcessingInr = financeInfo.totalProcessingInr || 0;
    const isOtcPaid = financeInfo.isOtcPaid || false;

    // Calculate remaining processing balance
    const remainingProcessing = await calculateRemainingProcessingBalance(studentId);

    // Get university information from student
    const universityList = student.enrolledUniversity || [];
    const countryList = student.enrolledCountry || [];
    const universityText = university || (universityList.length > 0 ? universityList[0] : 'Not specified');
    const countryText = countryList.length > 0 ? countryList[0] : (student.studyDestination || 'Not specified');
    
    // Get programme from student
    const programmeText = programme || student.intendedCourse || 'MBBS';
    
    // Get father's name - try to get from request or student data
    const fatherNameText = fatherName || 'Not provided';

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 0, bottom: 0, left: 50, right: 50 },
    });

    // Create a buffer to store PDF
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', async () => {
      try {
        const pdfBuffer = Buffer.concat(chunks);

        // Upload PDF to Cloudinary
        const timestamp = Date.now();
        
        // Upload as raw file (PDF) to preserve format
        const cloudinaryResult = await uploadToCloudinary(
          pdfBuffer,
          'edurizon/payment-receipts',
        );

        console.log('PDF uploaded to Cloudinary:', cloudinaryResult.secure_url);
        console.log('Resource type:', cloudinaryResult.resource_type);
        console.log('Format:', cloudinaryResult.format);
        console.log('Public ID:', cloudinaryResult.public_id);

        res.status(200).json({
          success: true,
          message: 'Payment acknowledgement receipt generated and uploaded successfully',
          url: cloudinaryResult.secure_url,
          data: {
            receiptUrl: cloudinaryResult.secure_url,
            studentId: student._id,
            studentName: studentName,
          },
        });
      } catch (error) {
        console.error('Error uploading PDF to Cloudinary:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to upload payment receipt PDF',
          error: error.message,
        });
      }
    });

    // PDF Content
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = 50;
    const contentWidth = pageWidth - 2 * margin;

    // Header Image
    const headerImagePath = path.join(__dirname, '../assets/header.jpg');
    try {
      const headerHeight = 120;
      doc.image(headerImagePath, 0, 0, { width: pageWidth, height: headerHeight });
    } catch (error) {
      console.error('Error loading header image:', error);
      // Fallback to text header if image fails
      doc.fontSize(24)
         .font('Times-Bold')
         .text('EDURIZON', margin, 50, { align: 'center' });
    }

    let yPosition = 140;

    // Two Column Layout - Match image design
    const col1Start = margin;
    const col2Start = margin + (contentWidth / 2) + 20;
    const colWidth = (contentWidth / 2) - 20;
    const startY = yPosition;

    // LEFT COLUMN - University Options & Charges
    let leftY = startY;
    
    doc.fontSize(12)
       .font('Times-Bold')
       .text('UNIVERSITY OPTIONS', col1Start, leftY);
    
    leftY += 20;
    doc.fontSize(11)
       .font('Times-Roman')
       .text(countryText, col1Start, leftY, { width: colWidth });
    
    leftY += 15;
    doc.text(universityText, col1Start, leftY, { width: colWidth });
    
    leftY += 25;
    doc.fontSize(12)
       .font('Times-Bold')
       .text('Processing Charge', col1Start, leftY);
    
    leftY += 18;
    const processingAmount = currency === 'INR' ? Number(paymentAmount) : totalProcessingInr;
    doc.fontSize(11)
       .font('Times-Roman')
       .text(`Rs ${processingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, col1Start, leftY, { width: colWidth });
    
    // Show OTC USD if applicable
    if (currency === 'USD' || totalOtcUsd > 0) {
      leftY += 15;
      doc.fontSize(10)
         .font('Times-Roman')
         .text(`OTC USD ${roundCurrency(totalOtcUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, col1Start, leftY, { width: colWidth });
    }
    
    leftY += 25;
    doc.fontSize(12)
       .font('Times-Bold')
       .text('Pending', col1Start, leftY);
    
    leftY += 18;
    const pendingAmount = currency === 'INR' ? remainingProcessing : (isOtcPaid ? 0 : totalOtcUsd);
    if (pendingAmount > 0) {
      doc.fontSize(11)
         .font('Times-Roman')
         .text(`Rs ${pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, col1Start, leftY, { width: colWidth });
      
      // Show pending OTC if applicable
      if (currency === 'USD' && !isOtcPaid && totalOtcUsd > 0) {
        leftY += 15;
        doc.fontSize(10)
           .font('Times-Roman')
           .text(`OTC USD ${roundCurrency(totalOtcUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, col1Start, leftY, { width: colWidth });
      }
    } else {
      doc.fontSize(11)
         .font('Times-Roman')
         .text('Rs 0', col1Start, leftY, { width: colWidth });
    }

    // RIGHT COLUMN - Student Details & Payment Acknowledgment
    let rightY = startY;
    
    doc.fontSize(12)
       .font('Times-Bold')
       .text('STUDENT DETAILS', col2Start, rightY);
    
    rightY += 20;
    doc.fontSize(11)
       .font('Times-Roman')
       .text(`NAME - ${studentName}`, col2Start, rightY, { width: colWidth });
    
    rightY += 18;
    doc.text(`FATHER NAME - ${fatherNameText}`, col2Start, rightY, { width: colWidth });
    
    rightY += 18;
    const receiptDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    doc.text(`DATE - ${receiptDate}`, col2Start, rightY, { width: colWidth });
    
    rightY += 18;
    doc.text(`PROGRAMME - ${programmeText} 2026`, col2Start, rightY, { width: colWidth });
    
    rightY += 30;
    
    // Payment Acknowledgment Text
    const paymentAmountInWords = currency === 'USD' 
      ? `$${roundCurrency(Number(paymentAmount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `Rs.${Number(paymentAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    doc.fontSize(11)
       .font('Times-Roman')
       .text(`We acknowledged receipt of ${paymentAmountInWords} only mode, on account of Processing fees`, col2Start, rightY, { 
         width: colWidth,
         lineGap: 4
       });
    
    rightY += 35;
    
    // Non-refundable Note
    doc.fontSize(11)
       .font('Times-Bold')
       .text('NB-It may be noted that this amount is non-refundable', col2Start, rightY, { width: colWidth });
    
    rightY += 20;
    
    // Signature line
    doc.moveTo(col2Start, rightY)
       .lineTo(col2Start + colWidth, rightY)
       .stroke();

    // Use the maximum Y position from both columns
    yPosition = Math.max(leftY, rightY) + 30;

    // Footer Section - Company Address and Contact
    const footerY = pageHeight - 60;
    
    doc.fontSize(9)
       .font('Times-Roman')
       .fillColor('#000000')
       .text('EDURIZON PVT LTD. 111,113,115, 1ST FLOOR, PLOT-6, SEC-12, DWARKA, NEW DELHI-75', margin, footerY, { 
         width: contentWidth,
         align: 'center'
       });
    
    doc.fontSize(9)
       .text('CONTACT DETAILS- 9873381377, 9999222564', margin, footerY + 15, { 
         width: contentWidth,
         align: 'center'
       });

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('Error generating payment receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate payment receipt',
      error: error.message,
    });
  }
};

const updateStudentEnrollment = async (req, res) => {
  try {
    const { studentId, countryName, universities } = req.body;

    // Validate required fields
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'studentId is required',
      });
    }

    // Fetch student details
    const student = await RegisteredStudent.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Handle multiple countries (comma separated)
    const countriesList = countryName
      ? countryName.split(',').map(c => c.trim()).filter(Boolean)
      : [];

    // Handle universities (string or array)
    const universitiesList = universities
      ? (Array.isArray(universities)
          ? universities.map(u => u.trim())
          : [universities.trim()]
        ).filter(Boolean)
      : [];

    // Ensure arrays exist
    if (!Array.isArray(student.enrolledCountry)) {
      student.enrolledCountry = [];
    }

    if (!Array.isArray(student.enrolledUniversity)) {
      student.enrolledUniversity = [];
    }

    // Add values WITHOUT duplicates
    countriesList.forEach(country => {
      if (!student.enrolledCountry.includes(country)) {
        student.enrolledCountry.push(country);
      }
    });

    universitiesList.forEach(university => {
      if (!student.enrolledUniversity.includes(university)) {
        student.enrolledUniversity.push(university);
      }
    });

    console.log('previous student',student)

    // Save document
    await student.save();
    const newStd = RegisteredStudent.findById(studentId)

    console.log('newStd', newStd)

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });

    res.status(200).json({
      success: true,
      message: 'Student enrollment updated successfully',
      data: {
        studentId: updatedStudent._id,
        enrolledCountry: updatedStudent.enrolledCountry,
        enrolledUniversity: updatedStudent.enrolledUniversity,
      },
    });
  } catch (error) {
    console.error('Error updating student enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student enrollment',
      error: error.message,
    });
  }
};

const updateFeeStructureAgreement = async (req, res) => {
  try {
    const student = await RegisteredStudent.findById(req.user._id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    if (!student.feeStructure) {
      return res.status(400).json({
        success: false,
        message: 'Fee structure not found for this student',
      });
    }

    // Update agreement status
    student.feeStructureAgreed = true;
    await student.save();

    // Send notification to finance admins using the admin notification API
    try {
      const { AdminUser } = require('../models/AdminUser');
      const financeAdmins = await AdminUser.find({
        role: { $in: ['finance', 'finance-admin', 'super-admin'] },
        active: true
      }).select('_id email name');

      if (financeAdmins.length > 0) {
        // Use the existing admin notification system
        // For now, we'll use the send-notifications endpoint pattern
        const axios = require('axios');
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        
        const notificationMessage = `${student.name} (${student.email}) has agreed to the fee structure terms and conditions.`;
        
        // If there's a direct way to send admin notifications, use it here
        // Otherwise, log it for now
        console.log('📧 Notification for finance admins:', notificationMessage);
        console.log('Finance admins to notify:', financeAdmins.map(a => ({ id: a._id, email: a.email })));
        
        // TODO: Implement admin notification system if needed
        // For now, this will be logged and can be viewed in admin dashboard
      }
    } catch (notifError) {
      console.error('Error sending notification to finance admins:', notifError);
      // Don't fail the request if notification fails
    }

    res.status(200).json({
      success: true,
      message: 'Fee structure agreement updated successfully',
      data: {
        studentId: student._id,
        feeStructureAgreed: student.feeStructureAgreed,
        feeStructureGeneratedDate: student.feeStructureGeneratedDate,
      },
    });
  } catch (error) {
    console.error('Error updating fee structure agreement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update fee structure agreement',
      error: error.message,
    });
  }
};

module.exports = { feeStructure, billStructure, updateStudentEnrollment, updateFeeStructureAgreement };
