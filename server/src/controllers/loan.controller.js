import mongoose from "mongoose";
import Loan from "../models/loan.model.js";
import Repayment from "../models/repayment.model.js";

export const create = async (req, res) => {
  console.log("endddddddddddddd");
  try {
    console.log(req.user, "req.user");
    const { role, id } = req.user; //extract role and user ID from the token
    if (role !== "customer")
      return res.status(403).json({ message: "Access denied" });

    const { amount, term } = req.body;
    if (!amount || !term)
      return res.status(400).json({ message: "Amount and term are required" });

    const loan = new Loan({ userId: id, amount, term });
    await loan.save();

    // generate repayments
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

    if (loans.length === 0) {
      return res.status(404).json({ message: "No loans found" });
    }

    // Fetch repayments for the loans
    const loanIds = loans.map((loan) => loan._id); // Get all loan IDs
    const repayments = await Repayment.find({ loanId: { $in: loanIds } });

    // Combine loans with their repayments
    const loansWithRepayments = loans.map((loan) => {
      return {
        ...loan.toObject(), // Convert Mongoose document to plain JS object
        repayments: repayments.filter((repayment) => repayment.loanId.equals(loan._id)),
      };
    });
    res.json(loansWithRepayments);
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

export const repayLoan = async (req, res) => {
  try {
    const { loanId, repaymentId, amount } = req.body;

    if (!loanId || !repaymentId || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    //find the loan and repayment record from the collection
    const loan = await Loan.findById(loanId);
    const repayment = await Repayment.findById(repaymentId);

    if (!loan || !repayment) {
      return res.status(404).json({ message: "Loan or repayment not found" });
    }

    if (repayment.amount > amount) {
      return res.status(400).json({ message: "Insufficient repayment amount" });
    }

    if (repayment.status == "PAID") {
      return res.status(400).json({ message: "Repayment already made" });
    }

    //update repayment record
    repayment.status = "PAID";
    await repayment.save();

    // check if all repayments are completed and update the loan status
    const remainingRepayments = await Repayment.find({ loanId, status: "PENDING" });
    if (remainingRepayments.length === 0) {
      loan.state = "PAID";
      await loan.save();
    }

    res.status(200).json({ message: "Repayment processed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
