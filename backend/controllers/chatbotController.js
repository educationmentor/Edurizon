const asyncHandler = require('express-async-handler');
const chatBotModel = require('../models/chatBotModel');
const Leads = require('../models/leadsModel');

const sendChatBotRequest = asyncHandler(async (req, res) => {
    try {
        const data = req.body;
        const request =await chatBotModel.create({
            name:data[2],
            phone:data[4],
            preferedCollege:data[0],
            city:data[3],
            budget:data[1]
        })

        await Leads.create({
          name:data[2],
          phone:data[4],
          courseName:data[0],
          status: 'pending',
          remark: 'Request Received from Chatbot, Budget: '+data[1]+', From City: '+data[3]
        })


        res.status(201).json({
            success: true,
            message: 'Consultation request created successfully',
            data:request
        });
    } catch (error) {
        console.error('Error creating consultation request:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating consultation request',
            error: error.message
        });
    }
});

module.exports= {sendChatBotRequest}