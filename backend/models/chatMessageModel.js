const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    senderType: {
      type: String,
      enum: ['student', 'counselor'],
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
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
      required: false // Made optional for user-based chat
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

// Custom validation to ensure either senderId/receiverId OR consultationRequest is provided
chatMessageSchema.pre('validate', function(next) {
  const hasUserFields = this.senderId && this.receiverId;
  const hasConsultationField = this.consultationRequest;
  
  if (!hasUserFields && !hasConsultationField) {
    return next(new Error('Either senderId/receiverId or consultationRequest must be provided'));
  }
  
  next();
});

// Index for faster querying
chatMessageSchema.index({ consultationRequest: 1, createdAt: 1 });
chatMessageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });
chatMessageSchema.index({ senderId: 1, createdAt: 1 });
chatMessageSchema.index({ receiverId: 1, createdAt: 1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;