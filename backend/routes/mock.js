import express from "express";
import {
  getSubjectMocks,
  startMock,
  submitMock
} from "../controllers/mockController.js";

import { ensureAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/subject/:subject", ensureAuth, getSubjectMocks);

router.get("/start/:mockId", ensureAuth, startMock);

router.post("/submit/:mockId", ensureAuth, submitMock);

export default router;