import { Router } from "express";
import { addAction, editAction, searchActions, deleteAction, getActionsByTrial, getAllDescriptionActions, addDescriptionAction, getAllTypeActions, deleteDescriptionAction, editDescriptionAction } from "../controllers/action.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/add", verifyToken, addAction);
router.post("/edit", verifyToken, editAction);
router.get("/search", verifyToken, searchActions);
router.get("/trial/:trialId", verifyToken, getActionsByTrial);
router.get("/description-actions", verifyToken, getAllDescriptionActions);
router.get("/type-actions", verifyToken, getAllTypeActions);
router.post("/description-action/add", verifyToken, addDescriptionAction);
router.post("/description-action/edit", verifyToken, editDescriptionAction);
router.delete("/description-action/:id", verifyToken, deleteDescriptionAction);
router.delete("/:id", verifyToken, deleteAction);

export default router;