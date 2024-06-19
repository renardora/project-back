import { Timestamp } from "bson";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    avatarUrl: String,
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "стажер",
        "повар/кассир",
        "универсал",
        "тренер-наставник",
        "менеджер",
        "директор",
      ],
      default: "повар/кассир",
      required: true,
    },
    birthDay: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    division: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
