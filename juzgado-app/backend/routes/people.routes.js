import { Router } from "express";
import { addPerson, editPerson, searchPeople } from "../controllers/people.controller.js";

const router = Router();

router.post("/add", addPerson);
router.post("/edit", editPerson);
router.get("/search", searchPeople);

export default router;