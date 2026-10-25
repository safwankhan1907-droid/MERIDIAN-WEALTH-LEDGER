const express = require('express');
const router = express.Router();
const Transaction = require('../Models/Transaction');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'meridian_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// @route   GET /api/transactions
// @desc    Get all transactions for logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const transactions = await Transaction.find({ userId: userId.toString() }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching transactions', error: err.message });
  }
});

// @route   POST /api/transactions
// @desc    Add a new transaction
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const { title, amount, type, category, date } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newTransaction = new Transaction({
      userId: userId.toString(),
      title,
      amount: Number(amount),
      type: type.toLowerCase(),
      category,
      date: date || Date.now(),
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error while creating transaction', error: err.message });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction by ID
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error while deleting transaction', error: err.message });
  }
});

module.exports = router;