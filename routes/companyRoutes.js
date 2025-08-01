const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const {
  addNewCompany,
  getCompanies,
} = require("../controllers/companyController");

const router = express.Router();

router.post("/companies", upload.single("logo"), addNewCompany);
router.get("/companies", getCompanies);

module.exports = router;
