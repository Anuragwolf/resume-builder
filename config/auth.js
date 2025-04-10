const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ success: false, message: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.json({ success: true, message: "Signup successful!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        req.session.user = { userId: user._id, name: user.name, email: user.email };
        req.session.save();

        res.json({ success: true, message: "Login successful!", user: req.session.user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Check Login Status
router.get("/check-login", (req, res) => {
    res.json({ loggedIn: !!req.session.user, user: req.session.user || null });
});

// Logout
router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ success: false, message: "Logout failed" });
        res.clearCookie("connect.sid");
        res.json({ success: true, message: "Logged out successfully" });
    });
});

module.exports = router;
