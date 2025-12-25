import MockTest from "../models/MockTest.js";
import Question from "../models/Question.js";

export const createSubjectMock = async (req, res) => {
  const { title, subject, totalQuestions, durationMinutes } = req.body;

  const questions = await Question.find({ subject });

  if (questions.length < totalQuestions) {
    return res.status(400).json({ message: "Not enough questions" });
  }

  const shuffled = questions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, totalQuestions);

  const mock = await MockTest.create({
    title,
    subject,
    totalQuestions,
    durationMinutes,
    questionIds: selected.map(q => q._id)
  });

  res.json(mock);
};
