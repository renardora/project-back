import { Timestamp } from "bson";
import mongoose from "mongoose";

const DocSchema = new mongoose.Schema(
  {
    nameFile: {
      type: String,
      required: true,
    },
    fileURL: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    subSection: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Doc", DocSchema);