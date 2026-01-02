require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const orderRoutes = require('./routes/orders');
const todoRoutes = require('./routes/todos');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

/* -------------------- Security: Rate Limiting -------------------- */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts. Try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/forgot', loginLimiter);

/* -------------------- Middleware -------------------- */
app.use(cors({
  origin: true,          // IMPORTANT: works for Railway + custom domain
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

/* -------------------- Static Frontend -------------------- */
/*
  ASSUMPTION:
  public/ folder is now inside backend/
  backend/public
*/
app.use(express.static(path.join(__dirname, 'public')));

/* -------------------- API Routes -------------------- */
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);

/* -------------------- Frontend Fallback -------------------- */
/*
  This ensures:
  - index.html loads on /
  - direct refresh on pages like /login.html works
*/
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* -------------------- MongoDB -------------------- */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

/* -------------------- Server -------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
