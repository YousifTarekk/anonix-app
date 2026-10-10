import mongoose from "mongoose";
import { config } from "dotenv";
import {env} from "../config/env.js";



mongoose
    .connect(env.db.url)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:");
        console.error(error);
    });