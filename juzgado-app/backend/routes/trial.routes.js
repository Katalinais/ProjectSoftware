import { Router } from "express";
import { addTrial, editTrial, searchTrials, getCategoriesByTrialType, getAllTrialTypes, getAllEntryTypes } from "../controllers/trial.controller.js";

const router = Router();

router.post("/add", authMiddleware, addTrial);
router.post("/edit", authMiddleware, editTrial);
router.get("/search", authMiddleware, searchTrials);
router.get("/categories", authMiddleware, getCategoriesByTrialType);
router.get("/types", authMiddleware, getAllTrialTypes);
router.get("/entry-types", authMiddleware, getAllEntryTypes);


export default router;

