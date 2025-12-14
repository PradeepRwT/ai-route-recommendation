const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

// DB connect
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const routeRoutes = require("./routes/routeRoutes");

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/route", routeRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("AI Route Recommendation Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});