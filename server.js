const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// --------------------
// Middleware
// --------------------

// ✅ Replaceable: CORS options frontend domain ke hisaab se adjust kar sakte ho
app.use(cors());

// ❌ Nahi replace karna: JSON body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
// FRONTEND: agar future me form submit hoga to useful

// --------------------
// Database Connection
// --------------------

// ❌ Nahi replace karna: db.js me already ready hai
connectDB();

// --------------------
// Static Frontend (IMPORTANT)
// --------------------

// FRONTEND:
// login.html, register.html, index.html yahin se serve honge
app.use(express.static(path.join(__dirname, "public")));

// --------------------
// Routes
// --------------------

// Existing combined routes
const routes = require("./routes");
app.use("/api", routes);
// ✅ Tumhara existing auth / posts routes yahin se kaam karte rahenge

// --------------------
// Fallback (Frontend routing support)
// --------------------

// FRONTEND:
// Agar koi unknown route aaye, index.html serve hoga
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --------------------
// Error handling middleware (LAST)
// --------------------

// ❌ Nahi replace karna: centralized error handling
app.use(errorHandler);

// --------------------
// Start server
// --------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // ✅ Replaceable: logging style optional
});
