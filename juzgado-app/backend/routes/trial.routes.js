import { Router } from "express";
import { addTrial, editTrial, searchTrials, getCategoriesByTrialType, getAllTrialTypes, getAllEntryTypes } from "../controllers/trial.controller.js";

const router = Router();

router.post("/add", addTrial);
router.post("/edit", editTrial);
router.get("/search", searchTrials);
router.get("/categories", getCategoriesByTrialType);
router.get("/types", getAllTrialTypes);
router.get("/entry-types", getAllEntryTypes);


export default router;

