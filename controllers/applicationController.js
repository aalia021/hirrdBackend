const Application = require("../models/Application");
const Job = require("../models/Job");

const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const candidateId = req.user._id;

    // check if already applied
    const existing = await Application.findOne({
      job_id: jobId,
      candidate_id: candidateId,
    });
    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume is required" });
    }

    const newApp = new Application({
      job_id: jobId,
      candidate_id: candidateId,
      resume: req.file.path,
    });

    await newApp.save();

    res
      .status(201)
      .json({ message: "Application submitted", application: newApp });
  } catch (error) {
    console.error("APPLY ERROR:", error);
    res.status(500).json({ message: "Failed to apply", error: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const candidateId = req.user._id;

    const applications = await Application.find({ candidate_id: candidateId })
      .populate({
        path: "job_id",
        select: "title company location",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    console.error("FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Status updated", application: updated });
  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

const getApplicationsForJob = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const jobId = req.params.jobId;

    // 🔐 Ensure the job belongs to this recruiter
    const job = await Job.findOne({ _id: jobId, recruiter_id: recruiterId });
    if (!job) {
      return res
        .status(403)
        .json({ message: "Access denied or job not found" });
    }

    const applications = await Application.find({ job_id: jobId })
      .populate("candidate_id", "name email") // populate user info
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    console.error("GET APPS FOR JOB ERROR:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

module.exports = {
  applyToJob,
  getApplications,
  updateApplicationStatus,
  getApplicationsForJob, // ✅ export
};
