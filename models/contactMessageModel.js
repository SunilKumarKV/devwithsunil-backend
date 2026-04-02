const pool = require("../config/db");

exports.create = ({ name, email, message }) =>
  pool.query(
    "INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING id, name, email, message, created_at",
    [name, email, message],
  );

exports.findAll = () =>
  pool.query(
    "SELECT id, name, email, message, created_at FROM contact_messages ORDER BY created_at DESC",
  );
