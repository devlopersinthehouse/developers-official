const express = require("express");
const db = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, (req, res) => {
  db.all("SELECT * FROM posts", [], (err, rows) => {
    res.json(rows);
  });
});

router.post("/", auth, (req, res) => {
  const { title, content } = req.body;
  db.run(
    "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
    [title, content, req.user.id],
    () => res.json({ message: "Post added" })
  );
});

module.exports = router;