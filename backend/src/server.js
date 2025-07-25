import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import notesRoutes from "./routes/notesRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import connectDB from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(rateLimiter);

// API routes
app.use("/api/notes", notesRoutes);
app.use("/api/ai", aiRoutes);

// Database connection
let dbConnected = false;
const connectDatabase = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error("Database connection failed:", error);
    }
  }
};

// Initialize database connection
connectDatabase();

// Serve Frontend (Production & Development)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path to frontend dist
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));

// Catch-all handler for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

export default app;
