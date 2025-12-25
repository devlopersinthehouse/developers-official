const mongoose = require("mongoose");

// ✅ Replaceable: yaha fields tumhare frontend post form ke hisaab se define kar sakte ho
// Example: title, content, author, image, tags etc.
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // ✅ Required: frontend post form me title mandatory hai
  },
  content: {
    type: String,
    required: true, // ✅ Required: frontend post content
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ❌ Nahi replace karna, backend reference User model ke liye
    required: true, // ✅ Required: frontend se login user id bhejna
  },
  image: {
    type: String,
    default: "", // ✅ Optional: frontend image upload URL
  },
  tags: {
    type: [String],
    default: [], // ✅ Optional: frontend tags array
  },
}, { timestamps: true }); // timestamps automatic createdAt / updatedAt

// ✅ Replaceable: extra methods agar frontend ko like / comment / view count chahiye
// Example: postSchema.methods.incrementViews = function(){ this.views += 1; this.save(); }

const Post = mongoose.model("Post", postSchema);

module.exports = Post; // ❌ Nahi replace karna, export ke liye
