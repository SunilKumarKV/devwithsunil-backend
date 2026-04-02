const { validationResult } = require("express-validator");
const courseModel = require("../models/courseModel");

exports.listCourses = async (req, res) => {
  const result = await courseModel.findAll();
  return res.json({ status: "success", data: result.rows });
};

exports.getCourse = async (req, res) => {
  const result = await courseModel.findById(req.params.id);
  if (!result.rows.length) {
    return res
      .status(404)
      .json({ status: "error", message: "Course not found" });
  }
  return res.json({ status: "success", data: result.rows[0] });
};

exports.createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
  }

  const result = await courseModel.create(req.body);
  return res.status(201).json({ status: "success", data: result.rows[0] });
};

exports.updateCourse = async (req, res) => {
  const result = await courseModel.update(req.params.id, req.body);
  if (!result.rows.length) {
    return res
      .status(404)
      .json({ status: "error", message: "Course not found" });
  }
  return res.json({ status: "success", data: result.rows[0] });
};

exports.deleteCourse = async (req, res) => {
  const result = await courseModel.remove(req.params.id);
  if (!result.rows.length) {
    return res
      .status(404)
      .json({ status: "error", message: "Course not found" });
  }
  return res.json({ status: "success", message: "Course deleted" });
};
