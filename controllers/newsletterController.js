const { validationResult } = require("express-validator");
const subscriberModel = require("../models/subscriberModel");

exports.subscribe = async (req, res) => {
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

  const { email } = req.body;
  const existing = await subscriberModel.findByEmail(email);
  if (existing.rows.length) {
    return res
      .status(409)
      .json({ status: "error", message: "Email already subscribed" });
  }

  const result = await subscriberModel.create(email);
  return res.status(201).json({ status: "success", data: result.rows[0] });
};

exports.list = async (req, res) => {
  const result = await subscriberModel.findAll();
  return res.json({ status: "success", data: result.rows });
};
