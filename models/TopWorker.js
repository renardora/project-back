import mongoose from "mongoose";

const TopWorkerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    currentUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    count: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("TopWorker", TopWorkerSchema);
