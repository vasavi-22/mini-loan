import { Router } from "express";
import { create, myloans, allloans, approve } from "../controllers/loan.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/create", authMiddleware, create);
router.get("/my-loans", authMiddleware, myloans);
router.get("/all-loans", authMiddleware, allloans);
router.patch("/approve/:id", authMiddleware, approve);

export default router;