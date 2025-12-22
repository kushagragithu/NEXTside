import mongoose from "mongoose";

const mockTestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  durationMinutes: { type: Number, required: true },

  questionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  }],

  isPaid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("MockTest", mockTestSchema);