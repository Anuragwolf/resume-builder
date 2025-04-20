// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const User = require('../models/User');

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: "Email already registered" 
      });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    req.session.userId = newUser._id;
    
    res.status(201).json({ 
      success: true, 
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    req.session.userId = user._id;
    
    const userProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      position: user.position,
      experience: user.experience,
      skills: user.skills,
      education: user.education
    };

    res.json({ 
      success: true, 
      message: "Login successful",
      user: userProfile
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: "Logout failed" 
      });
    }
    
    res.clearCookie("connect.sid");
    res.json({ 
      success: true, 
      message: "Logged out successfully" 
    });
  });
});

module.exports = router;