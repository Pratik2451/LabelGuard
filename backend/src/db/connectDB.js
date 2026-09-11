import dns from "dns";
import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.js";

try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (dnsErr) {
    console.warn(
        "[DNS] Could not set custom DNS servers, using system default:",
        dnsErr.message
    );
}

const connect_DB = async () => {
    try {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error(
                "MONGODB_URI environment variable is not defined"
            );
        }

        const targetDbName =
            process.env.DB_NAME || DB_NAME || "LabelGuard";

        const connectionInstance = await mongoose.connect(uri, {
            dbName: targetDbName
        });

        console.log(
            `MongoDB Connected successfully! DB HOST: ${connectionInstance.connection.host}, Database: ${targetDbName}`
        );

        return connectionInstance;
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
};

export default connect_DB;