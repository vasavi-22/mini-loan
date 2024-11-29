import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import { config } from "./src/config/index.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
// const corsOptions = {
//     origin: 'http://localhost:3000', // Frontend origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary methods
//     credentials: true, // Allow cookies and credentials
//     allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
// };
  
// Apply CORS middleware
// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); // Handle preflight requests

// Middleware for parsing JSON and URL-encoded data
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

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
  

