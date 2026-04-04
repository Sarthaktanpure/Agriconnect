const express = require("express");
const { getProfile, login, signup, updateProfile } = require("../controllers/authController");
const { authRateLimiter } = require("../middlewares/rateLimit");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/signup", authRateLimiter, signup);
router.post("/login", authRateLimiter, login);
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

module.exports = router;
