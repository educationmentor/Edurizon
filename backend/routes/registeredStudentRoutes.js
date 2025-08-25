const express = require('express');
const { createRegisteredStudent, getSingleRegisteredStudent, getAllRegisteredStudents,updateDocumentStatus,updateDocumentConditionStatus,sendRemark,addOneDocument,deleteOneDocument,addVideoData,updateRegisteredStudent,deleteRegisteredStudent } = require('../controllers/registeredUserController.js');
const router = express.Router();

router.post('/create', createRegisteredStudent);
router.get('/get-single/:id', getSingleRegisteredStudent);
router.get('/get-all', getAllRegisteredStudents);
router.put('/:id',updateRegisteredStudent);
router.delete('/:id',deleteRegisteredStudent);
// Routes for document Admin
router.put('/updateStatus/:id', updateDocumentStatus);
router.put('/updateDocumentConditionStatus/:id', updateDocumentConditionStatus);
router.delete('/deleteOneDocument/:id',deleteOneDocument)
router.post('/addOneDocument/:id',addOneDocument);
router.post('/sendRemark/:id', sendRemark);

router.patch('/addVideoData/:id',addVideoData)

module.exports = router;