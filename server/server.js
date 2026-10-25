const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected successfully'))
.catch((err) => console.log('MongoDB connection error:', err));

// --- ROUTES ---
const authRoutes = require('./Routes/authRoutes');
const transactionRoutes = require('./Routes/transaction'); // Small 't' fixed here

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// --- PRODUCTION STATIC SERVING ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});