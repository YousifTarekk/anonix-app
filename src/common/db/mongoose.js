import mongoose from "mongoose";
import { config } from "dotenv";

config();

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:");
        console.error(error);
    });