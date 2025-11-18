import { Router } from "express";
import { addPerson, editPerson, searchPeople } from "../controllers/people.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/add", verifyToken, addPerson);
router.post("/edit", verifyToken, editPerson);
router.get("/search", verifyToken, searchPeople);

export default router;