import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    firstName : { type : String, required : true},
    lastName : { type : String, required : true},
    email : { type : String, required : true, unique : true},
    password : { type : String, required : true},
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
});

// UserSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

const User = mongoose.model('User', UserSchema);

export default User;