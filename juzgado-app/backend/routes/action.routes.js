import { Router } from "express";
import { addAction, editAction, searchActions, deleteAction, getActionsByTrial, getAllDescriptionActions, addDescriptionAction, getAllTypeActions, deleteDescriptionAction, editDescriptionAction } from "../controllers/action.controller.js";

const router = Router();

router.post("/add", addAction);
router.post("/edit", editAction);
router.get("/search", searchActions);
router.get("/trial/:trialId", getActionsByTrial);
router.get("/description-actions", getAllDescriptionActions);
router.get("/type-actions", getAllTypeActions);
router.post("/description-action/add", addDescriptionAction);
router.post("/description-action/edit", editDescriptionAction);
router.delete("/description-action/:id", deleteDescriptionAction);
router.delete("/:id", deleteAction);

export default router;