const { validationResult } = require("express-validator");
const xss = require("xss");
const blogModel = require("../models/blogModel");

exports.getPosts = async (req, res, next) => {
  try {
    const result = await blogModel.findAll();
    return res.json({ posts: result.rows });
  } catch (err) {
    next(err);
  }
};

exports.getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Validate slug format (alphanumeric, hyphens, underscores only)
    if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid slug format",
      });
    }

    const result = await blogModel.findBySlug(slug);
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Post not found",
      });
    }

    return res.json({ post: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { slug, title, tag, date, excerpt, content, read_time } = req.body;

    // Validate content length
    if (content.length < 10) {
      return res.status(400).json({
        status: "error",
        message: "Content must be at least 10 characters long",
      });
    }

    if (content.length > 50000) {
      return res.status(400).json({
        status: "error",
        message: "Content must be less than 50,000 characters",
      });
    }

    // Validate slug format
    if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
      return res.status(400).json({
        status: "error",
        message:
          "Slug can only contain letters, numbers, hyphens, and underscores",
      });
    }

    const existing = await blogModel.findBySlug(slug);
    if (existing.rows.length) {
      return res.status(409).json({
        status: "error",
        message: "Slug already exists",
      });
    }

    // Sanitize content and excerpt
    const sanitizedContent = xss(content);
    const sanitizedExcerpt = xss(excerpt);

    const result = await blogModel.create({
      slug,
      title,
      tag,
      date,
      excerpt: sanitizedExcerpt,
      content: sanitizedContent,
      read_time,
    });

    return res.status(201).json({ status: "success", data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};
