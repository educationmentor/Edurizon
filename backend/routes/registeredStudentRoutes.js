const express = require('express');
const { createRegisteredStudent, getSingleRegisteredStudent, getAllRegisteredStudents } = require('../controllers/registeredUserController.js');
const router = express.Router();

router.post('/create', createRegisteredStudent);
router.get('/get-single/:id', getSingleRegisteredStudent);
router.get('/get-all', getAllRegisteredStudents);

module.exports = router;