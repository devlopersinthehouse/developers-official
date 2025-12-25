const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const authMiddleware = require("../middleware/auth");
const validateBody = require("../middleware/validate");
const Joi = require("joi");

// ✅ Replaceable: frontend post form fields
const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  tags: Joi.array().items(Joi.string())
});

// CREATE POST
router.post("/", authMiddleware, validateBody(postSchema), async (req, res) => {
  const { title, content, tags } = req.body;

  try {
    const post = new Post({
      title,
      content,
      tags: tags || [],
      author: req.user.id // ❌ Nahi replace karna, backend sets author from JWT
    });

    await post.save();
    res.json(post); 
    // ✅ Replaceable: frontend me agar fields customize chahiye to yahan adjust karo
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
});

// GET ALL POSTS
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name email");
    res.json(posts); 
    // ✅ Replaceable: frontend me populate fields adjust kar sakte ho
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
});

// GET POST BY ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" }); 
    // ✅ Replaceable: frontend alert message
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
});

// DELETE POST
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" }); 

    // ❌ Nahi replace karna: backend check author vs logged-in user
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" }); 
      // ✅ Replaceable: frontend alert message
    }

    await post.remove();
    res.json({ message: "Post removed" }); 
    // ✅ Replaceable: frontend confirmation message
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
});

module.exports = router; 
// ❌ Nahi replace karna
