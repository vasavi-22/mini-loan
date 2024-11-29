import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 },
});

const Session = new mongoose.model('Session', SessionSchema);

export default Session;