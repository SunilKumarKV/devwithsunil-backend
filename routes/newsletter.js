const express = require("express");
const { body } = require("express-validator");
const newsletterController = require("../controllers/newsletterController");
const { newsletterLimiter } = require("../middleware/endpointLimiters");

const router = express.Router();

router.post(
  "/subscribe",
  newsletterLimiter,
  [body("email").isEmail().withMessage("Valid email is required")],
  newsletterController.subscribe,
);

module.exports = router;
