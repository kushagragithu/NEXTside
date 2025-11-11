import Subject from "../models/Subject.js";
import Topic from "../models/Topic.js";
import Question from "../models/Question.js";
import express from 'express';
import path from 'path';
const router = express.Router();

router.get("/:subjectName/topics", (req, res) => {
  res.sendFile(path.join(path.resolve(), '../public/topics.html'));
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
  res.sendFile(path.join(path.resolve(), '../public/questionlist.html'));
});

// GET questions of a topic
router.get("/:subjectName/topics/:topicName/questions/data", async (req, res) => {
  const { subjectName, topicName } = req.params;
  const subject = await Subject.findOne({ name: subjectName });
  if (!subject) return res.status(404).json({ message: "Subject not found" });

  const topic = await Topic.findOne({ name: topicName, subject: subject._id });
  if (!topic) return res.status(404).json({ message: "Topic not found" });

  const questions = await Question.find({ topic: topic._id });
  res.json(questions);
});

// GET a specific question

router.get("/:subjectName/topics/:topicName/questions/:id", (req, res) => {
  res.sendFile(path.join(path.resolve(), '../public/question-mcq.html'));
});

router.get("/:subjectName/topics/:topicName/questions/:id/data", async (req, res) => {
  const questionData = await Question.findById(req.params.id);
  if (!questionData) return res.status(404).json({ message: "Question not found" });
  res.json(questionData);
});

export default router;