import express from "express";
const router = express.Router();
import {
  getAllNotes,
  createNote,
  deleteNote,
  updateNote,
  getNoteById,
} from "../controllers/notesController.js";

router.get("/", getAllNotes);

router.get("/:id", getNoteById);

router.post("/", createNote);

router.put("/:id", updateNote);

router.delete("/:id", deleteNote);

export default router;
