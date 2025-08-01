const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    const { title, description, location, company } = req.body;

    if (!title || !description || !location || !company) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const logoPath = req.file ? req.file.path : "";

    const job = new Job({
      title,
      description,
      location,
      company,
      logo: logoPath,
      recruiter_id: req.user._id,
    });

    await job.save();

    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Failed to load jobs" });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const jobs = await Job.find({ recruiter_id: recruiterId }).sort({
      createdAt: -1,
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error);
    res.status(500).json({ message: "Failed to load recruiter jobs" });
  }
};

const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const recruiterId = req.user._id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only allow editing if recruiter is the owner
    if (job.recruiter_id.toString() !== recruiterId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedFields = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      company: req.body.company,
    };

    if (req.file) {
      updatedFields.logo = req.file.path;
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, updatedFields, {
      new: true,
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const recruiterId = req.user._id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only allow delete if recruiter is the creator
    if (job.recruiter_id.toString() !== recruiterId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const toggleJobStatus = async (req, res) => {
  try {
    const jobId = req.params.id;
    const recruiterId = req.user._id;

    const job = await Job.findOne({ _id: jobId, recruiter_id: recruiterId });
    if (!job) {
      return res
        .status(403)
        .json({ message: "Not authorized or job not found" });
    }

    job.isOpen = !job.isOpen;
    await job.save();

    res.status(200).json({
      message: `Job is now ${job.isOpen ? "open" : "closed"}`,
      job,
    });
  } catch (error) {
    console.error("TOGGLE ERROR:", error);
    res.status(500).json({ message: "Failed to toggle status" });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getMyJobs,
  updateJob,
  deleteJob,
  toggleJobStatus,
};
