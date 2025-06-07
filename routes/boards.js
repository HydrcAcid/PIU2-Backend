import express from "express";
import { getContent, getBoardUsers, getBoardInfo, createBoard, removeBoard, updateCredentials, renameBoard } from "../controllers/boards.js";

const router = express.Router();

router.get("/lists/:id", getContent);
router.get("/users/:id", getBoardUsers);
router.get("/info/:id", getBoardInfo);
router.put("/rename/:id", renameBoard);
router.post("/add", createBoard);
router.delete("/remove/:id", removeBoard);
router.post("/join", updateCredentials);

export default router;