const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoute");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoute");
const savedJobRoutes = require("./routes/savedJobRoutes");
const companyRoutes = require("./routes/companyRoutes");

dotenv.config();

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // 👈 allow cookies
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/jobs", jobRoutes);
app.use("/api", applicationRoutes);
app.use("/api/jobs", savedJobRoutes);
app.use("/api", companyRoutes);

// Routes

// ✅ Only connect DB once here
connectDB()
  .then(() => {
    console.log("Database connection established ...");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is successfully listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
