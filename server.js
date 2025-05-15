const express = require("express");
const cors = require("cors");
const { body, validationResult } = require('express-validator');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require("dotenv").config();
// After your existing requires, add:
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Add this after your requires, before middleware setup
const allowedOrigins = [
    'https://naukariready.vercel.app',
    'https://www.naukariready.vercel.app',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5501',
    'http://localhost:5500',
    undefined,
    'null'
];

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "avatar-" + uniqueSuffix + ext);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."));
  }
};

// Initialize multer with our configuration
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});


const app = express();
// Fix the middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // Fix: urlParser -> urlencoded
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const PORT = process.env.PORT || 5000;

// ==============================================
// 🛠️ MIDDLEWARE SETUP
// ==============================================

// Update your CORS configuration
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    optionsSuccessStatus: 200
}));

// Update your additional headers middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

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
    company: String,
    industry: String,
    experience: String,
    skills: [String],
    education: String,
    avatar: String,
    appliedJobs: [
      {
        jobId: mongoose.Schema.Types.ObjectId,
        title: String,
        company: String,
        description: String,
        appliedAt: { type: Date, default: Date.now }
      }
    ]
  }, { timestamps: true });
  
// Add this after your User model definition
// ==============================================
// 💼 JOB MODEL
// ==============================================
// Keep your existing Job schema with minor modifications
const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    type: { type: String, required: true },
    experience: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    tags: [String],
    logo: String,
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isUserPosted: { type: Boolean, default: true }, // Flag to identify user-posted jobs
    createdAt: { type: Date, default: Date.now }
});

// Create a new schema for dummy/sample jobs
const DummyJobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    type: { type: String, required: true },
    experience: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    tags: [String],
    logo: String,
    isUserPosted: { type: Boolean, default: false }, // Always false for dummy jobs
    createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.model("Job", JobSchema);
const DummyJob = mongoose.model("DummyJob", DummyJobSchema);

// Function to seed dummy jobs (call this during initial setup)


// Call this function when your server starts

const User = mongoose.model("User", UserSchema);


// Add this helper function after UserSchema definition
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '7d'
    });
};

// Admin Schema
const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' }
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "No token provided",
            authenticated: false
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET_ADMIN || 'admin-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
                authenticated: false
            });
        }
        req.admin = decoded;
        next();
    });
};

// ==============================================
// 👑 ADMIN ROUTES
// ==============================================

// ADMIN LOGIN
app.post("/admin/login", 
    // ... existing validation ...
    async (req, res) => {
        try {
            // ... existing code ...
            res.json({
                success: true,
                message: "Admin login successful",
                token,
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                }
            });
        } catch (error) {
            // ... error handling ...
        }
    }
);
// GET ALL USERS (ADMIN ONLY)
app.get("/admin/users", authenticateAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
});

// GET ALL JOBS (ADMIN ONLY)
app.get("/admin/jobs", authenticateAdmin, async (req, res) => {
    try {
        const userJobs = await Job.find().populate('postedBy', 'name email');
        const dummyJobs = await DummyJob.find();
        
        res.json({
            success: true,
            userJobs,
            dummyJobs,
            totalJobs: userJobs.length + dummyJobs.length
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ success: false, message: "Failed to fetch jobs" });
    }
});

// DELETE USER (ADMIN ONLY)
app.delete("/admin/users/:id", authenticateAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        // Also delete jobs posted by this user
        await Job.deleteMany({ postedBy: req.params.id });
        
        res.json({
            success: true,
            message: "User and associated data deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Failed to delete user" });
    }
});

// DELETE JOB (ADMIN ONLY)
app.delete("/admin/jobs/:id", authenticateAdmin, async (req, res) => {
    try {
        // Try to delete from both collections
        const userJob = await Job.findByIdAndDelete(req.params.id);
        const dummyJob = await DummyJob.findByIdAndDelete(req.params.id);
        
        if (!userJob && !dummyJob) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        
        res.json({
            success: true,
            message: "Job deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ success: false, message: "Failed to delete job" });
    }
});

// GET STATISTICS (ADMIN ONLY)
app.get("/admin/stats", authenticateAdmin, async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        const userJobsCount = await Job.countDocuments();
        const dummyJobsCount = await DummyJob.countDocuments();
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email createdAt');
        
        res.json({
            success: true,
            stats: {
                totalUsers: usersCount,
                totalUserJobs: userJobsCount,
                totalDummyJobs: dummyJobsCount,
                totalJobs: userJobsCount + dummyJobsCount,
                recentUsers
            }
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ success: false, message: "Failed to fetch statistics" });
    }
});
// ==============================================
// 🔐 AUTH ROUTES
// ==============================================

// 🟢 SIGNUP
app.post("/signup", 
    [
        body('name').notEmpty().withMessage('Name is required')
            .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
        body('email').isEmail().withMessage('Please enter a valid email')
            .normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number'),
        body('location').optional().trim().escape(),
        body('position').optional().trim().escape(),
        body('experience').optional().trim().escape(),
        body('education').optional().trim().escape()
    ],
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            });
        }

        try {
            const { name, email, password, phone, location, position, experience, education } = req.body;

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
                password: hashedPassword,
                phone,
                location,
                position,
                experience,
                education
            });

            await newUser.save();
            
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
    }
);

// 🔵 LOGIN
app.post("/login", 
    [
        body('email').isEmail().withMessage('Please enter a valid email')
            .normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            });
        }

        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

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
                token
            });

        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ success: false, message: "Login failed" });
        }
    }
);

// 🔴 LOGOUT (No server-side logout needed with JWT)

// ==============================================
// 👤 CURRENT USER ROUTE (for profile page)
// ==============================================

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

// Update your current-user route to handle both authentication check and data retrieval
// ==============================================
// 📝 UPDATED PROFILE ROUTES
// ==============================================

// 🔄 UPDATE USER PROFILE
app.put("/update-profile", authenticateToken, async (req, res) => {
    try {
        const { 
            name, 
            phone, 
            location, 
            position, 
            company,
            industry,
            experience, 
            education,
            skills
        } = req.body;
        
        // Find user by ID (from token)
        const user = await User.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Update fields if provided
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (location !== undefined) user.location = location;
        if (position !== undefined) user.position = position;
        if (company !== undefined) user.company = company;
        if (industry !== undefined) user.industry = industry;
        if (experience !== undefined) user.experience = experience;
        if (education !== undefined) user.education = education;
        if (skills !== undefined) user.skills = skills;
        
        // Save the updated user
        await user.save();
        
        // Return updated user (excluding password)
        res.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                position: user.position,
                company: user.company,
                industry: user.industry,
                experience: user.experience,
                education: user.education,
                skills: user.skills,
                avatar: user.avatar
            }
        });
        
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile: " + error.message
        });
    }
});

// 📷 UPLOAD AVATAR (New endpoint)
// Note: This requires additional setup with multer for file handling
app.post('/upload-avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        // In a real implementation, you would:
        // 1. Upload the file to a storage service (AWS S3, etc.)
        // 2. Get the URL of the uploaded file
        // 3. Save that URL to the user's document

        // For this example, we'll assume the file is saved locally and accessible via URL
        const avatarUrl = `/uploads/${req.file.filename}`;
        
        // Update the user's avatar field
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { avatar: avatarUrl },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        res.json({
            success: true,
            message: "Avatar uploaded successfully",
            avatar: avatarUrl,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
        
    } catch (error) {
        console.error("Avatar upload error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload avatar: " + error.message
        });
    }
});

// 🔍 GET USER PROFILE (Enhanced)
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
                company: user.company || '',
                industry: user.industry || '',
                experience: user.experience || '',
                skills: user.skills || [],
                education: user.education || '',
                avatar: user.avatar || '',
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

// Updated apply-job route
app.post("/api/apply-job", authenticateToken, async (req, res) => {
    try {
        const { jobId, title, company, description } = req.body;

        console.log("Received application:", { 
            userId: req.user.userId,
            jobId, 
            title, 
            company 
        });

        // Check if jobId, title, or company is missing in the request body
        if (!jobId || !title || !company) {
            return res.status(400).json({ 
                success: false, 
                message: "Job ID, title, and company are required" 
            });
        }

        // Validate if the jobId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Job ID format" 
            });
        }

        // Convert jobId to ObjectId
        const jobObjectId = new mongoose.Types.ObjectId(jobId);

        // Check if the job exists (in either collection)
        let job = await Job.findById(jobObjectId);
        if (!job) {
            job = await DummyJob.findById(jobObjectId);
            if (!job) {
                return res.status(404).json({
                    success: false,
                    message: "Job not found"
                });
            }
        }

        // Create the job application object
        const appliedJob = {
            jobId: jobObjectId,
            title,
            company,
            description: description || "",
            appliedAt: new Date()
        };

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $push: { appliedJobs: appliedJob } },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.json({
            success: true,
            message: "Job applied successfully",
            user
        });

    } catch (err) {
        console.error("Apply job error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server error: " + err.message 
        });
    }
});
// Fix for remove-applied-job endpoint

// GET /my-applied-jobs route
app.get("/my-applied-jobs", authenticateToken, async (req, res) => {
    try {
        // Find the user by their userId (from the JWT token)
        const user = await User.findById(req.user.userId).select("appliedJobs");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Return the applied jobs
        res.json({
            success: true,
            appliedJobs: user.appliedJobs
        });
    } catch (err) {
        console.error("Error fetching applied jobs:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


// POST request to remove an applied job
// POST request to remove an applied job
app.post('/remove-applied-job', authenticateToken, async (req, res) => {
    const { jobId } = req.body;
    const userId = req.user.userId; // Fixed: changed from req.user.id to req.user.userId

    try {
        // Find the user and remove the job from their appliedJobs array
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { appliedJobs: { jobId: jobId } } }, // Pull the job from the appliedJobs array
            { new: true } // Return the updated user
        ).select("appliedJobs");

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        // Return the updated list of applied jobs
        res.status(200).json({
            success: true,
            message: 'Job removed successfully.',
            appliedJobs: user.appliedJobs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});

    // ==============================================
// 💼 JOB ROUTES
// ==============================================

// POST /api/jobs - Create a new job posting
app.post("/api/jobs", authenticateToken, async (req, res) => {
    try {
        const {
            title,
            company,
            type,
            experience,
            location,
            salary,
            description,
            requirements,
            tags,
            logo
        } = req.body;

        // Validate required fields
        if (!title || !company || !type || !experience || !location || !salary || !description || !requirements) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Create new job
        const newJob = new Job({
            title,
            company,
            type,
            experience,
            location,
            salary,
            description,
            requirements,
            tags: tags || [],
            logo: logo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(company),
            postedBy: req.user.userId,
            isUserPosted: true
        });

        await newJob.save();

        res.status(201).json({
            success: true,
            message: "Job posted successfully",
            job: newJob
        });

    } catch (error) {
        console.error("Job posting error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to post job: " + error.message
        });
    }
});


// GET /api/jobs - Get all jobs
app.get("/api/jobs", async (req, res) => {
    try {
        // Get query parameters
        const { type, isUserPosted } = req.query;
        
        let userJobs = [];
        let dummyJobs = [];
        
        // Filter options
        const filter = {};
        if (type) filter.type = type;
        
        // If specifically requesting only user-posted or dummy jobs
        if (isUserPosted === 'true') {
            userJobs = await Job.find(filter).sort({ createdAt: -1 });
            res.json({
                success: true,
                jobs: userJobs
            });
            return;
        } else if (isUserPosted === 'false') {
            dummyJobs = await DummyJob.find(filter).sort({ createdAt: -1 });
            res.json({
                success: true,
                jobs: dummyJobs
            });
            return;
        }
        
        // If no filter specified, get both types
        userJobs = await Job.find(filter).sort({ createdAt: -1 });
        dummyJobs = await DummyJob.find(filter).sort({ createdAt: -1 });
        
        // Combine the results
        const allJobs = [...userJobs, ...dummyJobs].sort((a, b) => 
            b.createdAt - a.createdAt
        );
        
        res.json({
            success: true,
            jobs: allJobs
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch jobs"
        });
    }
});

// GET /api/jobs/:id - Get single job by ID
app.get("/api/jobs/:id", async (req, res) => {
    try {
        // Try to find in user jobs first
        let job = await Job.findById(req.params.id);
        
        // If not found, try dummy jobs
        if (!job) {
            job = await DummyJob.findById(req.params.id);
        }
        
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        
        res.json({
            success: true,
            job
        });
    } catch (error) {
        console.error("Error fetching job:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch job"
        });
    }
});

// POST /api/dummy-jobs - Admin route to add dummy jobs (protected)
app.post("/api/dummy-jobs", authenticateToken, async (req, res) => {
    try {
        // You might want to add an isAdmin check here
        // if (!req.user.isAdmin) return res.status(403).json({success: false, message: "Unauthorized"});
        
        const {
            title,
            company,
            type,
            experience,
            location,
            salary,
            description,
            requirements,
            tags,
            logo
        } = req.body;

        // Validate required fields
        if (!title || !company || !type || !experience || !location || !salary || !description || !requirements) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Create new dummy job
        const newDummyJob = new DummyJob({
            title,
            company,
            type,
            experience,
            location,
            salary,
            description,
            requirements,
            tags: tags || [],
            logo: logo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(company),
            isUserPosted: false
        });

        await newDummyJob.save();

        res.status(201).json({
            success: true,
            message: "Dummy job created successfully",
            job: newDummyJob
        });

    } catch (error) {
        console.error("Dummy job creation error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create dummy job: " + error.message
        });
    }
});

// GET /api/my-jobs - Get only the authenticated user's posted jobs (from Job schema only)
app.get("/api/my-jobs", authenticateToken, async (req, res) => {
    try {
        // Find only jobs posted by the authenticated user
        const jobs = await Job.find({ postedBy: req.user.userId })
                             .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            jobs
        });
    } catch (error) {
        console.error("Error fetching user's jobs:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch jobs"
        });
    }
});

// DELETE /api/jobs/:id - Delete a job posting (only from Job schema)
app.delete("/api/jobs/:id", authenticateToken, async (req, res) => {
    try {
        const jobId = req.params.id;
        
        // Check if job exists and belongs to the user
        const job = await Job.findOne({ 
            _id: jobId,
            postedBy: req.user.userId
        });
        
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found or you don't have permission to delete it"
            });
        }
        
        // Delete the job
        await Job.findByIdAndDelete(jobId);
        
        res.json({
            success: true,
            message: "Job deleted successfully"
        });
        
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete job: " + error.message
        });
    }
});

//====================================
// 🚀 START SERVER
// ==============================================

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔗 Frontend: http://127.0.0.1:5500`);
    console.log(`🗄️ MongoDB: ${process.env.MONGODB_URI || "mongodb://localhost:27017/naukriDB"}\n`);
});
