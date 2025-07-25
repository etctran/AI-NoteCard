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

app.use("/api/notes", notesRoutes);
app.use("/api/ai", aiRoutes);

// Connect to database only once
let dbConnected = false;
if (!dbConnected) {
  await connectDB();
  dbConnected = true;
}

export default app;
