const express = require("express");
const { getOnboarding } = require("../controllers/onboardingController");

const router = express.Router();

router.get("/", getOnboarding);

module.exports = router;
