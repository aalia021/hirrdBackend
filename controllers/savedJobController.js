const SavedJob = require("../models/SavedJobs");

// Save or Unsave a job
const toggleSaveJob = async (req, res) => {
  try {
    const candidateId = req.user._id;
    const { jobId } = req.params;

    const existing = await SavedJob.findOne({
      candidate_id: candidateId,
      job_id: jobId,
    });

    if (existing) {
      await SavedJob.findByIdAndDelete(existing._id);
      return res.status(200).json({ message: "Job unsaved" });
    }

    const saved = new SavedJob({ candidate_id: candidateId, job_id: jobId });
    await saved.save();

    res.status(201).json({ message: "Job saved", saved });
  } catch (error) {
    console.error("SAVE JOB ERROR:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get all saved jobs for logged-in candidate
const getSavedJobs = async (req, res) => {
  try {
    const candidateId = req.user._id;

    const savedJobs = await SavedJob.find({ candidate_id: candidateId })
      .populate("job_id") // Populate job details
      .sort({ createdAt: -1 });

    res.status(200).json({ savedJobs });
  } catch (error) {
    console.error("FETCH SAVED JOBS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch saved jobs" });
  }
};

module.exports = { toggleSaveJob, getSavedJobs };
