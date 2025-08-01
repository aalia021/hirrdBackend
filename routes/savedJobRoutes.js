const express = require("express");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const {
  toggleSaveJob,
  getSavedJobs,
} = require("../controllers/savedJobController");

const router = express.Router();

// Save/Unsave a job
router.post("/save/:jobId", protect, allowRoles("candidate"), toggleSaveJob);

// Get all saved jobs
router.get("/saved", protect, allowRoles("candidate"), getSavedJobs);

module.exports = router;
