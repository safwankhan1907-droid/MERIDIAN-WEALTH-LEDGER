const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const app = express();

// 1. Security Headers (OWASP)
app.use(helmet());

// 2. Data Sanitization against NoSQL Query Injection
app.use(mongoSanitize());

// 3. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: 'Too many authentication attempts. Please try again later.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// Routes (matching exact filenames: authRoutes and transaction)
const authRoutes = require('./Routes/authRoutes');
const transactionRoutes = require('./Routes/transaction');

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://safwan:safwan1234@cluster0.mongodb.net/meridian';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas Connected Securely');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));