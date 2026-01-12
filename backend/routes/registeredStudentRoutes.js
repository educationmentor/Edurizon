const express = require('express');
const multer = require('multer');
const { createRegisteredStudent, getSingleRegisteredStudent, getAllRegisteredStudents,updateDocumentStatus,updateDocumentConditionStatus,sendRemark,addOneDocument,deleteOneDocument,addVideoData,updateRegisteredStudent,deleteRegisteredStudent,getRegisteredStudentsByCounsellor,loginRegisteredStudent,getCurrentUserProfile,uploadDocument,uploadFeesDocument } = require('../controllers/registeredUserController.js');
const { updateFeeStructureAgreement } = require('../controllers/financeAdminController');
const { protectRegisteredStudent } = require('../middleware/registeredStudentAuth');
const { protectAdminRoute } = require('../middleware/adminAuth');
const FinanceBill = require('../model/FinanceBill');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document types
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png|gif|txt/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only document files are allowed!'));
    }
  }
});

router.post('/create', createRegisteredStudent);
router.get('/get-single/:id', getSingleRegisteredStudent);
router.get('/get-all', getAllRegisteredStudents);
router.get('/get-by-counsellor/:counsellorId', getRegisteredStudentsByCounsellor);
router.put('/:id', protectAdminRoute, updateRegisteredStudent);
router.delete('/:id', protectAdminRoute, deleteRegisteredStudent);
router.post('/login',loginRegisteredStudent);

// Protected routes (authentication required)
router.get('/profile', protectRegisteredStudent, getCurrentUserProfile);
router.put('/fee-structure/agree', protectRegisteredStudent, updateFeeStructureAgreement);

// Get student's own bills
router.get('/bills', protectRegisteredStudent, async (req, res) => {
  try {
    const studentId = req.user._id;
    
    const bills = await FinanceBill.find({ studentId })
      .populate({ path: 'issuedBy', select: 'name email role' })
      .sort({ issueDate: -1 });

    // Add calculated status to each bill
    const billsWithStatus = bills.map(bill => {
      const outstanding = (bill.amountDue || 0) - (bill.amountPaid || 0);
      let status = 'Pending';
      if (outstanding <= 0) {
        status = 'Paid';
      } else if (bill.amountPaid > 0) {
        status = 'Partial Payment';
      }
      return {
        ...bill.toObject(),
        status,
        outstanding: Math.max(0, outstanding),
      };
    });

    res.json({
      success: true,
      data: billsWithStatus,
    });
  } catch (error) {
    console.error('Error fetching student bills:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bills',
    });
  }
});


// Routes for document Admin
router.put('/updateStatus/:id', updateDocumentStatus);
router.put('/updateDocumentConditionStatus/:id', updateDocumentConditionStatus);
router.delete('/deleteOneDocument/:id',deleteOneDocument)
router.post('/addOneDocument/:id',addOneDocument);
router.post('/sendRemark/:id', sendRemark);
router.post('/uploadDocument/:id', upload.single('document'), uploadDocument);
router.post('/uploadFeesDocument/:id', upload.single('document'), uploadFeesDocument);
router.patch('/addVideoData/:id',addVideoData)

module.exports = router;