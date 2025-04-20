    experience: String,

    education: String,
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model("User ", UserSchema);

// ==============================================
// 🛠️ SESSION SETUP
// ==============================================
app.use(session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/naukriDB" }),
    cookie: { 
        secure: false, // Must be false for non-HTTPS local development
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        sameSite: 'lax' // This helps with cross-site requests
    }
}));

// Make sure this middleware comes AFTER your session setup
app.use((req, res, next) => {
    // Debug middleware to check session
    console.log('Session ID:', req.sessionID);
    console.log('User ID in session:', req.session.userId);