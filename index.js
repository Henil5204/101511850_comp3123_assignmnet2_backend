require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/user");
const empRoutes = require("./routes/emp");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads")));

// Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", empRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("<h1>COMP3123 Assignment 2 Backend Running</h1>");
});

// Start Server + Connect DB
const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err.message);
    process.exit(1);
  });
