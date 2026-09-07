import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./config/db.js";

const app = express();

connectToDatabase()

app.use(cors({origin: process.env.ORIGINS.split(","), credentials: true}))
app.use(cookieParser())
app.use(express.json())

app.get("/", (req, res)=> res.send("Server is Live!"))

// Centralized error handler
app.use((rr, _req, res, _next)=>{
    console.error(`[Error] ${err.message}`);
    res.status(500).json({error: err.message})
})

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`)
})