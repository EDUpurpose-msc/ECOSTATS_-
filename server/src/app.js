import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import unitRoutes from "./routes/unitRoutes.js";
import requestedReportRoutes from "./routes/requestedReportRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import focalPersonRoutes from "./routes/focalPersonRoutes.js";
import sectorRoutes from "./routes/sectorRoutes.js";
import reportConfigRoutes from "./routes/reportConfigRoutes.js";
import reportDataRoutes from "./routes/reportDataRoutes.js";
import chartConfigRoutes from "./routes/chartConfigRoutes.js";
import colorSchemeRoutes from "./routes/colorSchemeRoutes.js";
import classificationRoutes from "./routes/classificationRoutes.js";

dotenv.config(); // Load environment variables from .env file
const app = express();

// Middleware for parsing JSON data
app.use(express.json());

// CORS configuration to allow frontend requests
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://ecostats.vercel.app'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1); // Exit if MongoDB fails to connect
    });

// Session configuration for storing sessions in MongoDB
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 14 * 24 * 60 * 60 // Session expiration in 14 days
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' // Ensure secure cookies in production
    }
}));

// Middleware for cookie parsing
app.use(cookieParser());

// Routes
app.use("/users", userRoutes);
app.use("/programs", programRoutes);
app.use("/units", unitRoutes);
app.use("/requested-reports", requestedReportRoutes);
app.use("/budgets", budgetRoutes);
app.use("/focal-persons", focalPersonRoutes);
app.use("/sectors", sectorRoutes);
app.use("/report-configs", reportConfigRoutes);
app.use("/report-data", reportDataRoutes);
app.use("/chart-config", chartConfigRoutes);
app.use("/color-scheme", colorSchemeRoutes);
app.use("/classification", classificationRoutes);

export default app;
