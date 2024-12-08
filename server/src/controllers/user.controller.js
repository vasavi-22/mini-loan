import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Session from "../models/session.model.js";

export const register = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(password);
    console.log(hashedPassword);
  
    try {
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      });
      await user.save();
      res.status(201).send("User created");
    } catch (error) {
      res.status(400).send("Error creating user");
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("log");

    try {
      console.log("loginnnnnnn");
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        return res.status(400).send("User not found");
      }
  
      console.log(password);
      console.log(user.password);
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
      if (!isMatch) {
        return res.status(400).send("Invalid credentials");
      }
      console.log("matchedddd");
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const session = new Session({ userId: user._id, token });
      await session.save();
      res.json({ token, user });

    } catch (error) {
      console.log(error,"errrrrrrrrrrrrrr");
      res.status(500).send("Server error");
    }
};

export const logout = async (req, res) => {
    const { token } = req.body; // Assuming the token is sent in the request body
  
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
  
    try {
      // Find and delete the session by token
      const session = await Session.findOneAndDelete({ token });
  
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      // Successfully logged out
      res.json({ message: "Logged out successfully" });

    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
};