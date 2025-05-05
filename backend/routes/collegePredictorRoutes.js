const express = require('express');
const router = express.Router();
const {fetchDatabaseMarks,fetchDatabaseRanks,collegePredictorSendData}=require('../controllers/collegePredictorController')

router.post('/retriveMarks', fetchDatabaseMarks);
router.post('/retriveRanks',fetchDatabaseRanks)
router.post('/sendData',collegePredictorSendData);
module.exports = router;