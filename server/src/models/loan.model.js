import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  term: { type: Number, required: true },
  state: { type: String, enum: ['PENDING', 'APPROVED', 'PAID'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now },
});

const Loan = mongoose.model('Loan', LoanSchema);

export default Loan;
