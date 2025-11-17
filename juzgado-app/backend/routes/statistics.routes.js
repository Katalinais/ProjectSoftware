import { Router } from "express";
import { getStatistics, generateReport } from "../controllers/statistics.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, getStatistics);
router.get("/report", verifyToken, generateReport);

export default router;

