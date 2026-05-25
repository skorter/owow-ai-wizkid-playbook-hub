const express = require("express");
const { getHealth, getDatabaseHealth } = require("../controllers/healthController");

const router = express.Router();

router.get("/", getHealth);
router.get("/database", getDatabaseHealth);

module.exports = router;
