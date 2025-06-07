import express from "express";
import { getinfo } from "../controllers/dashboard.js";

const router = express.Router();

router.get("/info", getinfo);

export default router;