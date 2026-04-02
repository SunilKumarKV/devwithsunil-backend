const express = require("express");
const { body } = require("express-validator");
const contactMessageController = require("../controllers/contactMessageController");
const { requireAuth, requireRole } = require("../middleware/auth");
const { contactLimiter } = require("../middleware/endpointLimiters");

const router = express.Router();

router.post(
  "/",
  contactLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("message").trim().notEmpty().withMessage("Message is required"),
  ],
  contactMessageController.submit,
);

router.get(
  "/",
  requireAuth,
  requireRole("admin"),
  contactMessageController.list,
);

module.exports = router;
