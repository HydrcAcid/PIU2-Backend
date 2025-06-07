import express from "express";
import { addList, removeList } from "../controllers/lists.js";

const router = express.Router();

router.post("/add/:id", addList);
router.delete("/remove/:id", removeList);

export default router;