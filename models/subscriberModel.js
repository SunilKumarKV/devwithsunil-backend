const pool = require("../config/db");

exports.findByEmail = (email) =>
  pool.query("SELECT id, email, created_at FROM subscribers WHERE email = $1", [
    email,
  ]);

exports.create = (email) =>
  pool.query(
    "INSERT INTO subscribers (email) VALUES ($1) RETURNING id, email, created_at",
    [email],
  );

exports.findAll = () =>
  pool.query(
    "SELECT id, email, created_at FROM subscribers ORDER BY created_at DESC",
  );
