const mongoose = require('mongoose');

const { Schema } = mongoose;

const paymentRecordSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    method: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const financeBillSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'RegisteredStudent',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    university: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amountDue: {
      type: Number,
      required: true,
      min: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Partial Payment', 'Paid', 'Overdue', 'Cancelled'],
      default: 'Pending',
    },
    paymentRecords: [paymentRecordSchema],
    issuedBy: {
      type: Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: true,
    },
    cancellationReason: {
      type: String,
      default: null,
      trim: true,
    },
    url:{
      type: String,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

const FinanceBill = mongoose.model('FinanceBill', financeBillSchema);

module.exports = FinanceBill;


