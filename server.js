const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==============================================
// 🛠️ MIDDLEWARE SETUP
// ==============================================

app.use(cookieParser());

// Enhanced CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://127.0.0.1:5500', 
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
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || "your_session_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/naukriDB",
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: "Please log in" });
    }
    next();
};

// ==============================================
// 🗄️ DATABASE CONNECTION
// ==============================================

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/naukriDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
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
    skills: [String],
    education: String,
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

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

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: "Email already registered" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword 
        });

        await newUser.save();

        // Create session
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

// 🔵 LOGIN (Session-based)
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Create session and return complete user data
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

// 🔴 LOGOUT
app.post("/logout", (req, res) => {
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

// ==============================================
// 👤 CURRENT USER ROUTE (for profile page)
// ==============================================

app.get("/current-user", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.json({ 
            success: true, 
            user 
        });

    } catch (error) {
        console.error("Current user error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch user data" 
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