const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { jwtSecret } = require("../config");

exports.requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ status: "error", message: "Authorization token missing" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, jwtSecret);
    const { rows } = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
      [payload.id],
    );
    if (!rows.length) {
      return res
        .status(401)
        .json({ status: "error", message: "User not found" });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid or expired token" });
  }
};

exports.requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ status: "error", message: "Unauthorized" });
  }

  if (req.user.role !== role) {
    return res
      .status(403)
      .json({ status: "error", message: "Insufficient permissions" });
  }

  next();
};
