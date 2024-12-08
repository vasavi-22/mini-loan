import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "./src/config/index.js";

import userRoutes from "./src/routes/user.route.js";
import loanRoutes from "./src/routes/loan.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
const corsOptions = {
    // origin: 'http://localhost:3000', // Frontend origin
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://mini-loan-rzyd.vercel.app",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary methods
    credentials: true, // Allow cookies and credentials
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
};
  
// Apply CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Session configuration
app.use(session({
    secret: 'mySuperSecretKey123456!',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true in production with HTTPS
}));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handlers
app.use('/user', userRoutes);
app.use('/loan', loanRoutes);

// Connect to MongoDB and start server
(async () => {
    try {
      await mongoose.connect(config.DATABASE);
      console.log('MongoDB connected');
      
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
    }
})();
  

