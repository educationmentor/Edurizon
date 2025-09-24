const express = require('express');
const multer = require('multer');
const { createRegisteredStudent, getSingleRegisteredStudent, getAllRegisteredStudents,updateDocumentStatus,updateDocumentConditionStatus,sendRemark,addOneDocument,deleteOneDocument,addVideoData,updateRegisteredStudent,deleteRegisteredStudent,getRegisteredStudentsByCounsellor,loginRegisteredStudent,getCurrentUserProfile,uploadDocument } = require('../controllers/registeredUserController.js');
const { protectRegisteredStudent } = require('../middleware/registeredStudentAuth');
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
router.put('/:id',updateRegisteredStudent);
router.delete('/:id',deleteRegisteredStudent);
router.post('/login',loginRegisteredStudent);

// Protected routes (authentication required)
router.get('/profile', protectRegisteredStudent, getCurrentUserProfile);


// Routes for document Admin
router.put('/updateStatus/:id', updateDocumentStatus);
router.put('/updateDocumentConditionStatus/:id', updateDocumentConditionStatus);
router.delete('/deleteOneDocument/:id',deleteOneDocument)
router.post('/addOneDocument/:id',addOneDocument);
router.post('/sendRemark/:id', sendRemark);
router.post('/uploadDocument/:id', upload.single('document'), uploadDocument);

router.patch('/addVideoData/:id',addVideoData)

module.exports = router;