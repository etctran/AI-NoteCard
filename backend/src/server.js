import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import notesRoutes from "./routes/notesRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import connectDB from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);
app.use("/api/ai", aiRoutes);

// Connect to database
await connectDB();

// Export the Express app for Vercel
export default app;
