const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const userModel = require("../models/userModel");

exports.getMe = async (req, res, next) => {
  try {
    return res.json({ status: "success", data: req.user });
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const updates = { name: req.body.name, email: req.body.email };
    if (req.body.password) {
      updates.password = await bcrypt.hash(req.body.password, 12);
    }

    const updated = await userModel.update(req.user.id, updates);
    if (!updated.rows.length) {
      return res.status(404).json({
        status: "error",
        message: "Unable to update profile",
      });
    }

    return res.json({ status: "success", data: updated.rows[0] });
  } catch (err) {
    next(err);
  }
};
