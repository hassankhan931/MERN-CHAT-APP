import express from "express";
import { getMessages, addMessage } from "../controllers/messageController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getMessages);
router.post("/", verifyToken, addMessage);

export default router;
