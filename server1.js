const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==============================================
// 🛠️ MIDDLEWARE SETUP
// ==============================================

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://127.0.0.1:5500', 
            'http://127.0.0.1:5501',
            'http://localhost:5500',
            'http://localhost:3000',
            'https://your-production-domain.com'
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    optionsSuccessStatus: 200
}));

app.use(express.json());

// ==============================================
// 🗄️ DATABASE CONNECTION
// ==============================================
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/naukriDB")
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ==============================================
// 🧑 USER MODEL
// ==============================================

const UserSchema = new mongoose.Schema({
        name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    location: String,
    position: String,
    experience: String,
    education: String,
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const user = mongoose.model("user ", UserSchema);

// Add this helper function after UserSchema definition
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '7d'
    });
};

// ==============================================
// 🛠️ SESSION SETUP
// ==============================================
// Update the development session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/naukriDB",
        touchAfter: 24 * 3600
    }),
    name: 'sessionId',
    cookie: { 
        secure: process.env.NODE_ENV === 'production',  // Only use secure in production
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
    }
}));

// Add trust proxy setting for production
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
    app.use(session({
        secret: process.env.SESSION_SECRET || "your_secret_key",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/naukriDB" }),
        name: 'sessionId',
        cookie: { 
            secure: true,
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'none',
            path: '/'
        },
        rolling: true
    }));
}

// Make sure this middleware comes AFTER your session setup
app.use((req, res, next) => {
    // Debug middleware to check session
    console.log('Session ID:', req.sessionID);
    console.log('User ID in session:', req.session.userId);
    next();
});

app.use((req, res, next) => {
    console.log('Session Debug:', {
        sessionID: req.sessionID,
        sessionData: req.session,
        cookies: req.headers.cookie,
        userId: req.session?.userId
    });
    next();
});

// Add this after the session middleware and before routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "No token provided",
            authenticated: false
        });
    }

    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
                authenticated: false
            });
        }
        req.user = decoded;
        next();
    });
};

// ==============================================
// 🔐 AUTH ROUTES
// ==============================================

// 🟢 SIGNUP
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        const existingUser  = await User.findOne({ email });
        if (existingUser ) {
            return res.status(409).json({ 
                success: false, 
                message: "Email already registered" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser  = new User({ 
            name, 
            email, 
            password: hashedPassword 
        });

        await newUser .save();

        res.status(201).json({ 
            success: true, 
            message: "User  created successfully",
            user: {
                id: newUser ._id,
                name: newUser .name,
                email: newUser .email
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

// 🔵 LOGIN
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Set session data
        req.session.userId = user._id.toString();  // Convert ObjectId to string
        
        // Wait for session to be saved
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) reject(err);
                resolve();
            });
        });

        const token = generateToken(user._id);

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
            user: userProfile,
            token // Send token to client
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Login failed" });
    }
});

// 🔴 LOGOUT
app.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: "Logout failed" 
            });
        }
        res.json({ 
            success: true, 
            message: "Logged out successfully" 
        });
    });
});

// ==============================================
// 👤 CURRENT USER ROUTE (for profile page)
// ==============================================



// Auth status check endpoint
app.get("/api/auth/status", (req, res) => {
    console.log("Auth status check", req.session);
    if (req.session.userId) {
        return res.json({ 
            authenticated: true, 
            userId: req.session.userId 
        });
    }
    res.json({ authenticated: false });
});

// Update your current-user route to handle both authentication check and data retrieval
app.get("/current-user", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                authenticated: false
            });
        }

        res.json({
            success: true,
            authenticated: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                position: user.position || '',
                experience: user.experience,
                skills: user.skills,
                education: user.education,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error("Current user error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            authenticated: false
        });
    }
});
// ==============================================
// 🚀 START SERVER
// ==============================================

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔗 Frontend: http://127.0.0.1:5500`);
    console.log(`🗄️ MongoDB: ${process.env.MONGODB_URI || "mongodb://localhost:27017/naukriDB"}\n`);
});