//start the server in server.js 

import express from 'express'
import connect_DB from "./db/connectDB.js";
import dotenv from "dotenv";
import app from "../app.js";

dotenv.config();

connect_DB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log("MongoDB connection failed", err);
});

