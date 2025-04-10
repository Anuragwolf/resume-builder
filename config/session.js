const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions",
        autoRemove: "interval",
        autoRemoveInterval: 10
    }),
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 1000 * 60 * 60 * 24 // 1 day session expiration
    }
});

module.exports = sessionMiddleware;
