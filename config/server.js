const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const sessionMiddleware = require("./config/session");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));
app.use(cookieParser());
app.use(sessionMiddleware);

// Routes
app.use("/api/auth", authRoutes);

// Start Server
connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
