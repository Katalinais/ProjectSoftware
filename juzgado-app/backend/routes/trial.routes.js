import { Router } from "express";
import { addTrial, editTrial, searchTrials, getCategoriesByTrialType, getAllTrialTypes, getAllEntryTypes } from "../controllers/trial.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/add", verifyToken, addTrial);
router.post("/edit", verifyToken, editTrial);
router.get("/search", verifyToken, searchTrials);
router.get("/categories", verifyToken, getCategoriesByTrialType);
router.get("/types", verifyToken, getAllTrialTypes);
router.get("/entry-types", verifyToken, getAllEntryTypes);


export default router;

