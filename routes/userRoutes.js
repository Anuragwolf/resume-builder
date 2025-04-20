// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require('../models/User');
const requireAuth = require("../config/middleware/auth");

// Get current user
router.get("/current-user", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select("-password");

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({ success: true, user });

  } catch (error) {
    console.error("Current user error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch user data" 
    });
  }
});

module.exports = router;