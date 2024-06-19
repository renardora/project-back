import mongoose from "mongoose"; 

const ScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true // предполагается, что у вас есть модель User
  },
  fullName: { type: String, required: true },
  time: { type: String, required: true },
  day: { type: String, required: true },
  date: { type: Date, required: true },
});

export default mongoose.model("Schedule", ScheduleSchema);
