const pool = require("../config/db");

exports.findAll = () =>
  pool.query("SELECT * FROM courses ORDER BY created_at DESC");
exports.findById = (id) =>
  pool.query("SELECT * FROM courses WHERE id = $1", [id]);
exports.create = ({ title, description, author, url, published }) =>
  pool.query(
    "INSERT INTO courses (title, description, author, url, published) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [title, description, author, url, published],
  );

exports.update = (id, data) => {
  const fields = [];
  const values = [];
  let idx = 1;
  const allowed = ["title", "description", "author", "url", "published"];

  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      fields.push(`${key} = $${idx++}`);
      values.push(data[key]);
    }
  }

  if (!fields.length) return Promise.resolve({ rows: [] });

  values.push(id);
  const query = `UPDATE courses SET ${fields.join(", ")}, updated_at = now() WHERE id = $${idx} RETURNING *`;
  return pool.query(query, values);
};

exports.remove = (id) =>
  pool.query("DELETE FROM courses WHERE id = $1 RETURNING *", [id]);
