import { Router } from "express";
import { addAction, editAction, searchActions, deleteAction, getActionsByTrial, getAllDescriptionActions, addDescriptionAction, getAllTypeActions, deleteDescriptionAction, editDescriptionAction } from "../controllers/action.controller.js";

const router = Router();

router.post("/add", authMiddleware, addAction);
router.post("/edit", authMiddleware, editAction);
router.get("/search", authMiddleware, searchActions);
router.get("/trial/:trialId", authMiddleware, getActionsByTrial);
router.get("/description-actions", authMiddleware, getAllDescriptionActions);
router.get("/type-actions", authMiddleware, getAllTypeActions);
router.post("/description-action/add", authMiddleware, addDescriptionAction);
router.post("/description-action/edit", authMiddleware, editDescriptionAction);
router.delete("/description-action/:id", authMiddleware, deleteDescriptionAction);
router.delete("/:id", authMiddleware, deleteAction);

export default router;