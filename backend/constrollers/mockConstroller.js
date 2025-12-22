export const getSubjectMocks = async (req, res) => {
  const { subject } = req.params;

  const mocks = await MockTest.find({ subject })
    .select("title totalQuestions durationMinutes");

  res.json(mocks);
};

/*  */

import UserMockAttempt from "../models/UserMockAttempt.js";

export const startMock = async (req, res) => {
  const userId = req.user.id;
  const { mockId } = req.params;

  const alreadyAttempted = await UserMockAttempt.findOne({
    userId,
    mockTestId: mockId
  });

  if (alreadyAttempted) {
    return res.status(403).json({ message: "Already attempted" });
  }

  const mock = await MockTest.findById(mockId)
    .populate("questionIds", "question options");

  const attempt = await UserMockAttempt.create({
    userId,
    mockTestId: mockId,
    startedAt: new Date()
  });

  res.json({
    mockTitle: mock.title,
    durationMinutes: mock.durationMinutes,
    questions: mock.questionIds,
    attemptId: attempt._id
  });
};

/*  */

export const submitMock = async (req, res) => {
  const userId = req.user.id;
  const { mockId } = req.params;
  const userAnswers = req.body.answers;

  const mock = await MockTest.findById(mockId)
    .populate("questionIds");

  let correct = 0, incorrect = 0;

  mock.questionIds.forEach(q => {
    if (!userAnswers[q._id]) return;
    if (userAnswers[q._id] === q.correctAnswer) correct++;
    else incorrect++;
  });

  const unattempted =
    mock.totalQuestions - (correct + incorrect);

  const score = correct;

  await UserMockAttempt.findOneAndUpdate(
    { userId, mockTestId: mockId },
    {
      answers: userAnswers,
      score,
      correct,
      incorrect,
      unattempted,
      submittedAt: new Date()
    }
  );

  res.json({ score, correct, incorrect, unattempted });
};