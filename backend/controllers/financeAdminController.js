const PDFDocument = require('pdfkit');
const path = require('path');
const { RegisteredStudent } = require('../models/registeredUserModel');
const { uploadToCloudinary } = require('../utils/cloudinary');

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

        // Update student's feeStructure field
        // Cloudinary should preserve the .pdf extension in the URL when public_id includes it
        student.feeStructure = cloudinaryResult.secure_url;
        await student.save();

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
    doc.text(`Country: ${countryName}`, col1Start, leftY, { width: colWidth });

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
       .text('Amount (USD)', col2, tableTop, { align: 'right' });

    yPosition = tableTop + itemHeight;
    doc.moveTo(margin, yPosition - 5)
       .lineTo(pageWidth - margin, yPosition - 5)
       .stroke();

    // One Time Charge
    doc.fontSize(11)
       .font('Times-Roman')
       .text('One Time Charge', col1, yPosition)
       .text(`$${Number(oneTimeCharge).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, col2, yPosition, { align: 'right' });
    
    yPosition += itemHeight;

    // Processing Charge
    doc.text('Processing Charge', col1, yPosition)
       .text(`$${Number(processingCharge).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, col2, yPosition, { align: 'right' });
    
    yPosition += itemHeight;

    // Additional Services
    if (ticketsIncluded) {
      doc.text('Flight Tickets (Included)', col1, yPosition)
         .text('Included', col2, yPosition, { align: 'right' });
      yPosition += itemHeight;
    }

    if (visasIncluded) {
      doc.text('Visa Processing (Included)', col1, yPosition)
         .text('Included', col2, yPosition, { align: 'right' });
      yPosition += itemHeight;
    }

    // Total
    yPosition += 10;
    doc.moveTo(margin, yPosition)
       .lineTo(pageWidth - margin, yPosition)
       .stroke();
    
    yPosition += 15;
    const totalAmount = Number(oneTimeCharge) + Number(processingCharge);
    doc.fontSize(12)
       .font('Times-Bold')
       .text('Total Amount', col1, yPosition)
       .text(`$${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, col2, yPosition, { align: 'right' });

    yPosition += 50;

    // Important Notes Section
    doc.fontSize(12)
       .font('Times-Bold')
       .text('Please Note:', margin, yPosition);
    
    yPosition += 20;
    doc.fontSize(10)
       .font('Times-Roman')
       .text('1. NEET qualification is mandatory.', margin + 10, yPosition, { width: contentWidth - 10 });
    
    yPosition += 15;
    doc.text('2. Final admission shall be strictly subject to the successful clearance of the entrance examination/interview, as and when conducted.', margin + 10, yPosition, { width: contentWidth - 10 });

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
        
        const currentDate = new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        doc.text(`Generated on: ${currentDate}`, margin, footerY + 45, { align: 'center' });
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
        
        const currentDate = new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        doc.text(`Generated on: ${currentDate}`, margin, yPosition + 45, { align: 'center' });
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
      status
    } = req.body;

    // Validate required fields
    if (!studentId || !paymentAmount || !paymentNumber || !studentName || !university) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: studentId, paymentAmount, paymentNumber, studentName, and university are required',
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

    // Title
    doc.fontSize(18)
       .font('Times-Bold')
       .text('Payment Acknowledgement Receipt', margin, yPosition, { align: 'center' });

    yPosition += 50;

    // Main Content
    doc.fontSize(12)
       .font('Times-Roman')
       .text('Edurizon Pvt. Ltd. hereby acknowledges the receipt of Rs. ', margin, yPosition, { 
         width: contentWidth,
         lineGap: 6,
         continued: true 
       })
       .font('Times-Bold')
       .text(`${Number(paymentAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, { 
         continued: true 
       })
       .font('Times-Roman')
       .text(` (Payment No. `, { continued: true })
       .font('Times-Bold')
       .text(`${paymentNumber}`, { continued: true })
       .font('Times-Roman')
       .text(`, as per the fee structure under the "Payment Timeline" heading) from Mr./Ms. `, { continued: true })
       .font('Times-Bold')
       .text(`${studentName} `, { continued: true })
       .font('Times-Roman')
       .text(' towards registration and related charges.', { 
         align: 'justify',
         lineGap: 6,
       });

    yPosition += 40;

    // Second paragraph
    doc.fontSize(12)
       .font('Times-Roman')
       .text('The above-mentioned student has opted for MBBS admission at ', margin, yPosition, { 
         width: contentWidth,
         lineGap: 6,
         continued: true 
       })
       .font('Times-Bold')
       .text(`${university} `, { continued: true })
       .font('Times-Roman')
       .text(' University for the 2026 academic session through Edurizon Pvt. Ltd.', { 
         align: 'justify',
         lineGap: 6,
       });

    yPosition += 50;

    // Please Note Section
    doc.fontSize(12)
       .font('Times-Bold')
       .text('Please Note:', margin, yPosition);
    
    yPosition += 25;
    doc.fontSize(11)
       .font('Times-Roman')
       .text('1. NEET qualification is mandatory.', margin + 10, yPosition, { width: contentWidth - 10 });
    
    yPosition += 40;
    doc.text('2. Final admission shall be strictly subject to the successful clearance of the entrance examination/interview, as and when conducted.', margin + 10, yPosition, { width: contentWidth - 10 });

    yPosition += 40;
    doc.text('3. This receipt only confirms the payment made towards registration and does not guarantee final admission, which is subject to the clearance of entrance exam or interview.', margin + 10, yPosition, { width: contentWidth - 10 });

    yPosition += 50;

    // Footer Image - Position at bottom of page
    const footerImagePath = status==='due'? path.join(__dirname, '../assets/footer2.png'): path.join(__dirname, '../assets/footer.png');
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
           .text('This is a system-generated payment acknowledgement receipt.', margin, footerY + 30, { align: 'center' });
        
        const currentDate = new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        doc.text(`Generated on: ${currentDate}`, margin, footerY + 45, { align: 'center' });
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
           .text('This is a system-generated payment acknowledgement receipt.', margin, yPosition + 30, { align: 'center' });
        
        const currentDate = new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        doc.text(`Generated on: ${currentDate}`, margin, yPosition + 45, { align: 'center' });
      }
    }

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

module.exports = { feeStructure, billStructure };
