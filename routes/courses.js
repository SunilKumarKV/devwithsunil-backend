const express = require("express");
const { body } = require("express-validator");
const courseController = require("../controllers/courseController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", courseController.listCourses);
router.get("/:id", courseController.getCourse);

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("author").trim().notEmpty().withMessage("Author is required"),
    body("url").isURL().withMessage("Valid URL is required"),
    body("published").isBoolean().withMessage("Published must be boolean"),
  ],
  courseController.createCourse,
);

router.put(
  "/:id",
  requireAuth,
  requireRole("admin"),
  courseController.updateCourse,
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  courseController.deleteCourse,
);

module.exports = router;
