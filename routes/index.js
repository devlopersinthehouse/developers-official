const express = require("express");
const router = express.Router();

// ✅ Replaceable: Agar aur routes add karna ho to yaha import karo
const authRoutes = require("./auth");
const postRoutes = require("./posts");
const paymentRoutes = require("./payment");

// Mount routes
router.use("/auth", authRoutes);      // Frontend calls /api/auth/register or /api/auth/login
router.use("/posts", postRoutes);     // Frontend calls /api/posts/...
router.use("/payment", paymentRoutes); // Frontend calls /api/payment/create or /api/payment/history

// ✅ Replaceable: Agar frontend ke liye aur base paths chahiye, yaha adjust karo
// Example: router.use("/users", userRoutes);

module.exports = router; 
// ❌ Nahi replace karna, backend main server me import ke liye
