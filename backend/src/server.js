import dotenv from "dotenv";
import connect_DB from "./db/connectDB.js";
import app from "../app.js";

dotenv.config();

const PORT = parseInt(process.env.PORT, 10) || 8000;
const HOST = "0.0.0.0";

connect_DB()
    .then(() => {
        const server = app.listen(PORT, HOST, () => {
            console.log("=========================================");
            console.log(`LabelGuard API Server running on port ${PORT}`);
            console.log(`Listening on http://${HOST}:${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
            console.log("=========================================");
        });

        const shutdown = (signal) => {
            console.log(`Received ${signal}. Shutting down server gracefully...`);

            server.close(() => {
                console.log("HTTP server closed.");
                process.exit(0);
            });
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    })
    .catch((err) => {
        console.error(
            "CRITICAL: MongoDB connection failed during startup:",
            err
        );
        process.exit(1);
    });