const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const challengeRoute = require('./routes/challengeDataRoute');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware2
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://contri-frontend.vercel.app"],
  })
);
app.use(express.json());

app.use("/api/v1/challengeData", challengeRoute);

app.get("/", (req, res) => {
  res.send("Hello, Welcome to challenge creation!");
});

mongoose
  .connect(
    `mongodb+srv://21it3001:${process.env.MONGODB_PASS}@cluster0.k86if.mongodb.net/`
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
