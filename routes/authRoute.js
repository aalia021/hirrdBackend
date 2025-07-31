const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// 👇 Add test route
router.get("/me", protect, (req, res) => {
  res.json({ message: "Protected route", user: req.user });
});

module.exports = router;
