import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", routes);
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));


app.get("/", (req, res) => {
    res.status(200).json({
        message: "HRMS API is Running"
    });
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.szvuh.mongodb.net/hrmsdb`).then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server is running on port 3000");
    });
});