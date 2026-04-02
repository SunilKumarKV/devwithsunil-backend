const express = require("express");
const { body } = require("express-validator");
const contactController = require("../controllers/contactController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("message").trim().notEmpty().withMessage("Message is required"),
  ],
  contactController.submit,
);

router.get(
  "/",
  requireAuth,
  requireRole("admin"),
  contactController.listContacts,
);

module.exports = router;
