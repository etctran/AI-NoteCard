import mongoose from "mongoose";

// Create a schema
// Then create a model based off of that schema

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
