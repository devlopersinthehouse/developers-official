const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// ✅ Replaceable: CORS options frontend domain ke hisaab se adjust kar sakte ho
app.use(cors()); 
app.use(express.json()); // ❌ Nahi replace karna, JSON body parsing ke liye

// Connect to MongoDB
connectDB(); // ❌ Nahi replace karna, db.js me ready hai

// Routes
const routes = require("./routes"); 
app.use("/api", routes); 
// ✅ Replaceable: agar frontend base path /api nahi hai, yaha adjust kar sakte ho

// Error handling middleware
app.use(errorHandler); 
// ❌ Nahi replace karna, sab backend errors centralized handle honge

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // ✅ Replaceable: console message optional, frontend affect nahi karega
});
