import express from "express";
import { createSubjectMock } from "../controllers/adminController.js";
import adminMiddleware from "../middleware/admin.js";
import { ensureAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/mock/subject", ensureAuth, adminMiddleware, createSubjectMock);

export default router;
