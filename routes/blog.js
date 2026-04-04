const express = require("express");
const { body } = require("express-validator");
const blogController = require("../controllers/blogController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/posts", blogController.getPosts);
router.get("/posts/:slug", blogController.getPostBySlug);

router.post(
  "/posts",
  requireAuth,
  requireRole("admin"),
  [
    body("slug").trim().notEmpty().withMessage("Slug is required"),
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("tag").trim().notEmpty().withMessage("Tag is required"),
    body("date").isISO8601().withMessage("Valid date is required"),
    body("excerpt").trim().notEmpty().withMessage("Excerpt is required"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("read_time")
      .isInt({ min: 1 })
      .withMessage("Read time must be an integer in minutes"),
  ],
  blogController.createPost,
);

module.exports = router;
