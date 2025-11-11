import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String],
  answer: String,
  explanation: String,
  topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true }
});

export default mongoose.model("Question", questionSchema);