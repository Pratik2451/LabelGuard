import dns from "dns"
dns.setServers(["8.8.8.8", "8.8.4.4"]);



import express from "express"
import { DB_NAME } from "../utils/constants.js"
import mongoose from "mongoose"


const connect_DB = async (req, res) =>{
    try {
        const connection_Instance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log(`MongoDB Connected !! DB HOST: ${connection_Instance.connection.host}`);
        
    } catch (error) {
        console.log("MongoDB connection error:", error);
        process.exit(1);
    }
}




export default connect_DB;