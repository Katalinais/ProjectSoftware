import { Router } from "express";
import { addPerson, editPerson, searchPeople } from "../controllers/people.controller.js";

const router = Router();

router.post("/add", authMiddleware, addPerson);
router.post("/edit", authMiddleware, editPerson);
router.get("/search", authMiddleware, searchPeople);

export default router;