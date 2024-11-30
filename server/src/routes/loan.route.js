import { Router } from "express";
import { create, myloans, allloans, approve, repayLoan } from "../controllers/loan.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/create", authMiddleware, create);
router.get("/my-loans", authMiddleware, myloans);
router.get("/all-loans", authMiddleware, allloans);
router.patch("/approve/:id", authMiddleware, approve);
router.post("/repay", authMiddleware, repayLoan);

export default router;