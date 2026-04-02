const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const { jwtSecret, jwtExpiration } = require("../config");

const issueToken = (user) =>
  jwt.sign({ id: user.id, role: user.role, email: user.email }, jwtSecret, {
    expiresIn: jwtExpiration,
  });

exports.register = async (req, res, next) => {
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

  const { name, email, password } = req.body;
  const found = await userModel.findByEmail(email);
  if (found.rows.length) {
    return res
      .status(409)
      .json({ status: "error", message: "Email already registered" });
  }

  const hashed = await bcrypt.hash(password, 12);
  const newUser = await userModel.create(name, email, hashed);

  const token = issueToken(newUser.rows[0]);
  return res
    .status(201)
    .json({ status: "success", data: { user: newUser.rows[0], token } });
};

exports.login = async (req, res, next) => {
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

  const { email, password } = req.body;
  const userRes = await userModel.findByEmail(email);
  if (!userRes.rows.length) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid credentials" });
  }

  const user = userRes.rows[0];
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid credentials" });
  }

  const token = issueToken(user);
  return res.json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
};
