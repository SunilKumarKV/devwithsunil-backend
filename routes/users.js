const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/me", requireAuth, userController.getMe);

router.put(
  "/me",
  requireAuth,
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be 6+ characters"),
  ],
  userController.updateMe,
);

module.exports = router;
