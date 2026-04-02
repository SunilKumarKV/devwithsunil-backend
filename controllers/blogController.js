const { validationResult } = require("express-validator");
const blogModel = require("../models/blogModel");

exports.listPosts = async (req, res) => {
  const result = await blogModel.findAll();
  return res.json({ status: "success", data: result.rows });
};

exports.createPost = async (req, res) => {
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

  const { slug, title, tag, date, excerpt, content, read_time } = req.body;
  const existing = await blogModel.findBySlug(slug);
  if (existing.rows.length) {
    return res
      .status(409)
      .json({ status: "error", message: "Slug already exists" });
  }

  const result = await blogModel.create({
    slug,
    title,
    tag,
    date,
    excerpt,
    content,
    read_time,
  });
  return res.status(201).json({ status: "success", data: result.rows[0] });
};
