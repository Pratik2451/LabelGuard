import crypto from "crypto";
import fs from "fs";

/**
 * Calculate SHA-256 hash of a file on disk
 * @param {string} filePath 
 * @returns {Promise<string>} Hex-encoded SHA-256 digest
 */
export async function calculateFileSha256(filePath) {
    return new Promise((resolve, reject) => {
        try {
            const hash = crypto.createHash("sha256");
            const stream = fs.createReadStream(filePath);

            stream.on("data", (chunk) => hash.update(chunk));
            stream.on("end", () => resolve(hash.digest("hex")));
            stream.on("error", (err) => reject(err));
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Calculate SHA-256 hash of a string or buffer
 * @param {string|Buffer} data 
 * @returns {string} Hex-encoded SHA-256 digest
 */
export function calculateBufferSha256(data) {
    return crypto.createHash("sha256").update(data).digest("hex");
}

