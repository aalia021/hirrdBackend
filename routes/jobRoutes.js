const express = require("express");
const {
  createJob,
  getAllJobs,
  getMyJobs,
  updateJob,
  deleteJob,
  toggleJobStatus,
} = require("../controllers/jobController");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getAllJobs);
router.get("/my", protect, allowRoles("recruiter"), getMyJobs);
router.post(
  "/",
  protect,
  allowRoles("recruiter"),
  upload.single("logo"),
  createJob
);
router.put(
  "/:id",
  protect,
  allowRoles("recruiter"),
  upload.single("logo"),
  updateJob
);
router.delete("/:id", protect, allowRoles("recruiter"), deleteJob);
router.patch("/:id/toggle", protect, allowRoles("recruiter"), toggleJobStatus);

module.exports = router;
