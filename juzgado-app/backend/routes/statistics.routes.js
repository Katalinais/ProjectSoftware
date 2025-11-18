import { Router } from "express";
import { getStatistics, generateReport } from "../controllers/statistics.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getStatistics);
router.get("/report", authMiddleware, generateReport);

export default router;

