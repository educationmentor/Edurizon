const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    senderType: {
      type: String,
      enum: ['student', 'counselor'],
      required: true
    },
    senderEmail: {
      type: String,
      required: true
    },
    senderName: {
      type: String,
      required: true
    },
    consultationRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ConsultationRequest',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    delivered: {
      type: Boolean,
      default: false
    },
    clientMessageId: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for faster querying
chatMessageSchema.index({ consultationRequest: 1, createdAt: 1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;