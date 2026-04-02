const pool = require("../config/db");

exports.findAll = () =>
  pool.query("SELECT * FROM blog_posts ORDER BY date DESC");

exports.findBySlug = (slug) =>
  pool.query("SELECT * FROM blog_posts WHERE slug = $1", [slug]);

exports.create = ({ slug, title, tag, date, excerpt, content, read_time }) =>
  pool.query(
    "INSERT INTO blog_posts (slug, title, tag, date, excerpt, content, read_time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [slug, title, tag, date, excerpt, content, read_time],
  );
