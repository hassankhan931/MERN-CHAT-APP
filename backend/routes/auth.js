import express from "express";
import { register, login } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// ✅ verify token route
router.get("/verify", verifyToken, (req, res) => {
  res.json({ message: "Valid token" });
});

export default router;
