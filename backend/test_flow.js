import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const API_URL = "http://localhost:5000/api/v1";

async function testPipeline() {
    try {
        console.log("1. Registering/Logging in test user...");
        const testCreds = {
            username: "labeluser_" + Date.now(),
            email: `labeluser_${Date.now()}@example.com`,
            password: "Password123!"
        };

        console.log("Registering test user:", testCreds.email);
        await axios.post(`${API_URL}/user/register`, testCreds);
        
        console.log("Logging in test user...");
        const loginRes = await axios.post(`${API_URL}/user/login`, {
            email: testCreds.email,
            username: testCreds.username,
            password: testCreds.password
        });

        const accessToken = loginRes.data.data.accessToken;
        console.log("Logged in successfully! Token acquired.");

        console.log("\n2. Uploading 2 product label images for OCR inspection...");
        const form = new FormData();
        const img1Path = path.resolve("../ocr/parle.jpeg");
        const img2Path = path.resolve("../ocr/shipping_label.webp");

        form.append("images", fs.createReadStream(img1Path));
        form.append("images", fs.createReadStream(img2Path));

        console.log("Sending POST request to /api/v1/products...");
        const uploadRes = await axios.post(`${API_URL}/products`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${accessToken}`
            }
        });

        console.log("\n========== UPLOAD & OCR SUCCESS ==========");
        console.log("Status:", uploadRes.status);
        console.log("Inspection ID:", uploadRes.data.data.inspectionId);
        console.log("Created By (User ID):", uploadRes.data.data.createdBy);
        console.log("Original Images Stored:", uploadRes.data.data.originalImages);
        console.log("Structured Product Data:\n", JSON.stringify(uploadRes.data.data.structuredData, null, 2));

        const productId = uploadRes.data.data._id;

        console.log("\n3. Testing GET /api/v1/products (Inspection History)...");
        const historyRes = await axios.get(`${API_URL}/products`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log("Total Inspections Found for User:", historyRes.data.data.length);

        console.log("\n4. Testing GET /api/v1/products/:id (Single Inspection)...");
        const singleRes = await axios.get(`${API_URL}/products/${productId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log("Fetched Single Product Inspection ID:", singleRes.data.data.inspectionId);

        console.log("\n==========================================");
        console.log("ALL TESTS PASSED SUCCESSFULLY!");
        console.log("==========================================\n");
        process.exit(0);

    } catch (error) {
        console.error("Test failed:", error?.response?.data || error.message);
        process.exit(1);
    }
}

testPipeline();
