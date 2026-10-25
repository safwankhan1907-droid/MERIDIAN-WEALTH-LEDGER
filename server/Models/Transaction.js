const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  type: { 
    type: String, 
    required: true, 
    lowercase: true,
    trim: true 
  },
  category: { 
    type: String, 
    required: true, 
    trim: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);