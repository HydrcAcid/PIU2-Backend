import express from "express";
import { addTask, updateTask, removeTask } from "../controllers/tasks.js";

const router = express.Router();

router.post("/add/:id", addTask);
router.put("/state/:id", updateTask);
router.delete("/remove/:id", removeTask);

export default router;