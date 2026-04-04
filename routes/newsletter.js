const express = require("express");
const { body } = require("express-validator");
const newsletterController = require("../controllers/newsletterController");
const { requireAuth, requireRole } = require("../middleware/auth");
const { newsletterLimiter } = require("../middleware/endpointLimiters");

const router = express.Router();

router.post(
  "/subscribe",
  newsletterLimiter,
  [body("email").isEmail().withMessage("Valid email is required")],
  newsletterController.subscribe,
);

// Admin route to list all subscribers
router.get(
  "/subscribers",
  requireAuth,
  requireRole("admin"),
  newsletterController.list,
);

module.exports = router;
