const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    medicalRecordNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    lastPurchaseDate: {
      type: Date
    },
    remarks: {
      type: String,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true // This will automatically add createdAt and updatedAt fields
  }
);

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;