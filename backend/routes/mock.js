import express from "express";
import {
  getSubjectMocks,
  startMock,
  submitMock
} from "../controllers/mockController.js";

import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/subject/:subject", authMiddleware, getSubjectMocks);

router.get("/start/:mockId", authMiddleware, startMock);

router.post("/submit/:mockId", authMiddleware, submitMock);

export default router;