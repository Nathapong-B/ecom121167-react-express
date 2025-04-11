const express = require("express");
const router = express.Router();
const { adminValidate } = require("../middlewares/authService");
const { reportPerDay, getCount } = require("../controllers/reportController");
const { validate_datetime_format, validate_date_duration } = require("../middlewares/pre-check-data");

// admin > input {"dayStart":"2025-03-13" , "dayEnd":"2025-03-13"}
router.post('/report/sales/report-per-day', adminValidate, validate_datetime_format, validate_date_duration, reportPerDay);
// count the number of records (user,product,category)
router.get('/report/get-count/:table', adminValidate, getCount);

module.exports = router;