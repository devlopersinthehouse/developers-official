require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');  // ← NAYA ADD

const todoRoutes = require('./routes/todos');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5000',  // Ya '*' development mein
  credentials: true                 // Cookie bhejne ke liye zaroori
}));
app.use(express.json());
app.use(cookieParser());            // ← NAYA ADD - cookie read karne ke liye

// ===== Static files serve karo (HTML, CSS, JS) =====
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);

// ===== Fallback route (SPA behavior) =====
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Server Start
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Open browser and go to: http://localhost:${PORT}`);
});