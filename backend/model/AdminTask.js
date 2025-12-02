const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: true,
    },
    replyMessage: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const adminTaskSchema = new mongoose.Schema(
  {
    messageDetail: {
      type: String,
      required: true,
      trim: true,
    },
    // Distinguish between a task (with deadline) and a general update/announcement
    taskType: {
      type: String,
      enum: ['Task', 'Update'],
      default: 'Task',
    },
    deadline: {
      type: Date,
      // Deadline is only required/meaningful for actual tasks
      required: false,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: true,
    },
    assignedTo: [
      {
        adminId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'AdminUser',
          required: true,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
        isDeleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    replies: {
      type: [replySchema],
      default: [],
    },
    senderHasNewReply: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Overdue'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminTask', adminTaskSchema);

