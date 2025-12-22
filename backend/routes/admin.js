import express from "express";
import { createSubjectMock } from "../controllers/adminController.js";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";

const router = express.Router();

// Create subject-wise mock
router.post("/mock/subject", authMiddleware, adminMiddleware, createSubjectMock);

export default router;
