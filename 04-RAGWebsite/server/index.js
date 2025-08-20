import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import apiRoutes from './routes/apiRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { connectDB } from './config/dbConnection.js';

// Connect to the database
await connectDB();

// Create an instance of the Express application
const app = express();

// Define the port for the server to listen on
const port = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Also allow URL-encoded form data (needed for form-data text fields)
app.use(express.urlencoded({ extended: true }));

// Configure CORS to allow specific origins
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === process.env.CLIENT_URL || origin === "http://localhost:5173") {
      callback(null, true); // allow Postman/curl or the specific origin
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware to log the endpoint of each request
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Define the routes
app.use("/api", apiRoutes);

// Use the error handling middleware
app.use(errorHandler);

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
