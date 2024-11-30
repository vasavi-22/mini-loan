import mongoose from "mongoose";
import Loan from "../models/loan.model.js";
import Repayment from "../models/repayment.model.js";

export const create = async (req, res) => {
  console.log("endddddddddddddd");
  try {
    console.log(req.user, "req.user");
    const { role, id } = req.user; // Extract role and user ID from the token
    if (role !== "customer")
      return res.status(403).json({ message: "Access denied" });

    const { amount, term } = req.body;
    if (!amount || !term)
      return res.status(400).json({ message: "Amount and term are required" });

    const loan = new Loan({ userId: id, amount, term });
    await loan.save();

    // Generate repayments
    const repayments = [];
    const weeklyAmount = (amount / term).toFixed(2);
    for (let i = 1; i <= term; i++) {
      repayments.push({
        loanId: loan._id,
        amount:
          i === term
            ? (amount - weeklyAmount * (term - 1)).toFixed(2)
            : weeklyAmount,
        dueDate: new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000),
      });
    }
    await Repayment.insertMany(repayments);

    res.status(201).json({ message: "Loan created successfully", loan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const myloans = async (req, res) => {
  try {
    const { role, id } = req.user;
    console.log(role);
    console.log(id);
    if (role !== "customer")
      return res.status(403).json({ message: "Access denied" });

    const loans = await Loan.find({ userId: new mongoose.Types.ObjectId(id) }).populate(
      "userId",
      "name email"
    );
    console.log(loans);
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const allloans = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const loans = await Loan.find().populate("userId", "name email");
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approve = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const loanId = req.params.id;
    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    if (loan.state !== "PENDING")
      return res
        .status(400)
        .json({ message: "Only pending loans can be approved" });

    loan.state = "APPROVED";
    await loan.save();

    res.json({ message: "Loan approved successfully", loan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
