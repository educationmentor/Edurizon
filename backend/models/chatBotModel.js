const mongoose = require('mongoose');

const chatbotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  budget: {
    type: String,
    required:true
  },
  city: {
    type: String,
    required: true
  },
  preferedCollege:{
    type:String,
    required:true,
    },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatBot', chatbotSchema); 