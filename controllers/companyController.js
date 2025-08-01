const Company = require("../models/Company");

const addNewCompany = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !req.file) {
      return res
        .status(400)
        .json({ message: "Company name and logo are required" });
    }

    const logo_url = req.file.path;

    const company = new Company({ name, logo_url });
    await company.save();

    res.status(201).json({ message: "Company created", company });
  } catch (error) {
    console.error("COMPANY CREATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.status(200).json(companies);
  } catch (error) {
    console.error("FETCH COMPANIES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch companies" });
  }
};

module.exports = { addNewCompany, getCompanies };
