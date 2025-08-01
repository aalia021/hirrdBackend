const express = require("express");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const {
  applyToJob,
  getApplications,
  updateApplicationStatus,
  getApplicationsForJob,
} = require("../controllers/applicationController");
const upload = require("../middleware/uploadResumeMiddleware");

const router = express.Router();

// POST /api/jobs/:id/apply
router.post(
  "/jobs/:id/apply",
  protect,
  allowRoles("candidate"),
  upload.single("resume"),
  applyToJob
);

router.get("/applications", protect, allowRoles("candidate"), getApplications);

router.patch(
  "/applications/:id/status",
  protect,
  allowRoles("recruiter"),
  updateApplicationStatus
);

router.get(
  "/jobs/:jobId/applications",
  protect,
  allowRoles("recruiter"),
  getApplicationsForJob
);

module.exports = router;
