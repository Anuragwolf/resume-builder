const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// After your existing requires, add:
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
    cb(
      new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.")
    );
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
// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const PORT = process.env.PORT || 5000;

// ==============================================
// 🛠️ MIDDLEWARE SETUP
// ==============================================

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://127.0.0.1:5500",
        "http://127.0.0.1:5501",
        "http://localhost:5500",
        "http://localhost:3000",
        "https://your-production-domain.com",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Keep this for potential future use of cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

// ==============================================
// 🗄️ DATABASE CONNECTION
// ==============================================
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/naukriDB")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ==============================================
// 🧑 USER MODEL
// ==============================================
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    location: String,
    position: String,
    company: String,
    industry: String,
    experience: String,
    skills: [String], // Array of skills
    education: {
      degree: String,
      university: String,
      graduationYear: String,
    }, // Store education details
    avatar: String, // URL to user avatar
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

// Add this helper function after UserSchema definition
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d",
  });
};

// ==============================================
// 🔐 AUTH ROUTES
// ==============================================

// 🟢 SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      location,
      position,
      experience,
      education,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
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
      education,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
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
        message: "Invalid credentials",
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
      education: user.education,
    };

    res.json({
      success: true,
      message: "Login successful",
      user: userProfile,
      token, // Send token to client
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// 🔴 LOGOUT (No server-side logout needed with JWT)

// ==============================================
// 👤 CURRENT USER ROUTE (for profile page)
// ==============================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
      authenticated: false,
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET || "your-secret-key", (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
        authenticated: false,
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
      skills,
    } = req.body;

    // Find user by ID (from token)
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
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

    // Update education details
    if (education) {
      user.education = {
        degree: education.degree !== undefined ? education.degree : user.education?.degree || '',
        university: education.university !== undefined ? education.university : user.education?.university || '',
        graduationYear: education.graduationYear !== undefined ? education.graduationYear : user.education?.graduationYear || ''
      };
    }
    
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
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile: " + error.message,
    });
  }
});

// 📷 UPLOAD AVATAR (New endpoint)
// Note: This requires additional setup with multer for file handling
app.post(
  "/upload-avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
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
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
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
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload avatar: " + error.message,
      });
    }
  }
);

// 🔍 GET USER PROFILE (Enhanced)
app.get("/current-user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        authenticated: false,
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
        position: user.position || "",
        company: user.company || "",
        industry: user.industry || "",
        experience: user.experience || "",
        skills: user.skills || [],
        education: user.education || {
          degree: '',
          university: '',
          graduationYear: ''
        },
        avatar: user.avatar || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Current user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      authenticated: false,
    });
  }
});
//====================================
// 🚀 START SERVER
// ==============================================

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔗 Frontend: http://127.0.0.1:5500`);
  console.log(
    `🗄️ MongoDB: ${process.env.MONGODB_URI || "mongodb://localhost:27017/naukriDB"
    }\n`
  );
});
