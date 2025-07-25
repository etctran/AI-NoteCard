import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import notesRoutes from "../backend/src/routes/notesRoutes.js";
import aiRoutes from "../backend/src/routes/aiRoutes.js";
import connectDB from "../backend/src/config/db.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
}));

// Connect to database
let dbConnected = false;

const ensureDbConnection = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error("Database connection failed:", error);
    }
  }
};

// Root route for testing
app.get("/", (req, res) => {
  res.json({ 
    message: "NoteCard API is running!", 
    timestamp: new Date().toISOString(),
    routes: ["/api/notes", "/api/ai"]
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes with database connection
app.use("/api/notes", async (req, res, next) => {
  await ensureDbConnection();
  next();
}, notesRoutes);

app.use("/api/ai", async (req, res, next) => {
  await ensureDbConnection();
  next();
}, aiRoutes);

// Export for Vercel
export default app;
