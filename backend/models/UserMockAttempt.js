import mongoose from "mongoose";

const userMockAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  mockTestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MockTest"
  },

  answers: {
    type: Map,
    of: String
  },

  score: Number,
  correct: Number,
  incorrect: Number,
  unattempted: Number,

  startedAt: Date,
  submittedAt: Date
});

export default mongoose.model("UserMockAttempt", userMockAttemptSchema);