import mongoose from "mongoose";

const RepaymentSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' },
});

const Repayment = mongoose.model('Repayment', RepaymentSchema);

export default Repayment;
