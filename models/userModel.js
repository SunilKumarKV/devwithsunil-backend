const pool = require("../config/db");

exports.findByEmail = (email) => {
  return pool.query(
    "SELECT id, name, email, role, password, created_at FROM users WHERE email = $1",
    [email],
  );
};

exports.findById = (id) => {
  return pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
    [id],
  );
};

exports.create = (name, email, password) => {
  return pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role, created_at",
    [name, email, password],
  );
};

exports.update = (id, { name, email, password }) => {
  const clauses = [];
  const values = [];
  let idx = 1;

  if (name) {
    clauses.push(`name = $${idx++}`);
    values.push(name);
  }
  if (email) {
    clauses.push(`email = $${idx++}`);
    values.push(email);
  }
  if (password) {
    clauses.push(`password = $${idx++}`);
    values.push(password);
  }

  if (!clauses.length) {
    return Promise.resolve({ rows: [] });
  }

  values.push(id);
  const text = `UPDATE users SET ${clauses.join(", ")}, updated_at = now() WHERE id = $${idx} RETURNING id, name, email, role, created_at`;
  return pool.query(text, values);
};
