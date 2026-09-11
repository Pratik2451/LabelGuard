//start the express server in app.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
// ==========================================
// CORS Configuration for Production & Local
// ==========================================
const configuredOrigins = [
    process.env.CORS_ORIGIN,
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173"
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        if (process.env.CORS_ORIGIN === "*") return callback(null, true);

        // Check if origin matches configured origins or any Vercel deployment preview
        const isAllowed = configuredOrigins.includes(origin) ||
            origin.endsWith(".vercel.app") ||
            origin.includes("localhost");

        if (isAllowed) {
            callback(null, true);
        } else {
            // For hackathon/demo robustness, allow with origin reflected if origin present
            callback(null, true);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "x-idempotency-key",
        "X-Requested-With",
        "Accept"
    ]
};

app.use(cors(corsOptions));

// Body parsing with safe limits for multi-surface inspection payloads
app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: true, limit: "16mb" }));
app.use(cookieParser());

// ==========================================
// Health & Diagnostic Endpoints (for Render)
// ==========================================
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        service: "LabelGuard API",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get("/", (req, res) => {
    res.status(200).json({
        name: "LabelGuard Inspection System API",
        status: "ACTIVE",
        version: "1.0.0",
        documentation: "SIH 2026 PS 26034 - Legal Metrology Packaged Commodities Compliance"
    });
});

app.post("/test", (req, res) => {
    console.log(req.body);
    res.json({
        success: true,
        body: req.body
    });
});

// import expenseRoutes from "./src/routes/expense.routes.js"
// app.use("/api/v1/expense", expenseRoutes);
// ==========================================
// Static Assets (Evidence Images)
// ==========================================
app.use("/public", cors(corsOptions), express.static("public"));
// app.use(cors(corsOptions), express.static("public"));

// app.use("/public", express.static("public"));
// app.use(express.static("public"));


// ==========================================
// Application API Routes
// ==========================================
import userRoutes from "./src/routes/user.routes.js";
app.use("/api/v1/user", userRoutes);

import productRoutes from "./src/routes/product.routes.js"
// import productRoutes from "./src/routes/product.routes.js";
app.use("/api/v1/products", productRoutes);

export default app;