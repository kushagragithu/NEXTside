import Subject from "../models/Subject.js";
import Topic from "../models/Topic.js";
import Question from "../models/Question.js";
import express from 'express';
import path from 'path';
const ROOT = path.resolve();
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'public/index.html'));
});

router.get("/data", async (req, res) => {
  try {
    const subjects = await Subject.find();

    const subjectData = await Promise.all(
      subjects.map(async (s) => {
        const topics = await Topic.find({ subject: s._id }, { _id: 1 });
        const topicIds = topics.map(t => t._id);

        const totalQuestions = await Question.countDocuments({ topic: { $in: topicIds } });
        return {
          name: s.name,
          displayName: s.displayName || s.name,
          totalQuestions
        };
      })
    );

    res.json(subjectData);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:subjectName/topics", (req, res) => {
  res.sendFile(path.join(ROOT, 'public/topics.html'));
});

router.get("/:subjectName/topics/data", async (req, res) => {
  const { subjectName } = req.params;

  const subject = await Subject.findOne({ name: subjectName });
  if (!subject) return res.status(404).json({ message: "Subject not found" });

  const topics = await Topic.find({ subject: subject._id });
  const topicsWithCount = await Promise.all(
    topics.map(async (t) => {
      const count = await Question.countDocuments({ topic: t._id });
      return { name: t.name, totalQuestions: count };
    })
  );

  res.json(topicsWithCount);
});

router.get("/:subjectName/topics/:topicName/questions", (req, res) => {
  res.sendFile(path.join(ROOT, 'public/questionlist.html'));
});

router.get("/:subjectName/topics/:topicName/questions/data", async (req, res) => {
  const { subjectName, topicName } = req.params;
  const subject = await Subject.findOne({ name: subjectName });
  if (!subject) return res.status(404).json({ message: "Subject not found" });

  const topic = await Topic.findOne({ name: topicName, subject: subject._id });
  if (!topic) return res.status(404).json({ message: "Topic not found" });

  const questions = await Question.find({ topic: topic._id });
  res.json(questions);
});

router.get("/:subjectName/topics/:topicName/questions/:id", (req, res) => {
  res.sendFile(path.join(ROOT, 'public/question-mcq.html'));
});

router.get("/:subjectName/topics/:topicName/questions/:id/data", async (req, res) => {
  const questionData = await Question.findById(req.params.id);
  if (!questionData) return res.status(404).json({ message: "Question not found" });
  res.json(questionData);
});

export default router;