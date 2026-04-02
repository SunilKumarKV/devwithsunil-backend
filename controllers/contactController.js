const { validationResult } = require("express-validator");
const contactModel = require("../models/contactModel");

exports.submit = async (req, res) => {
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

  const result = await contactModel.create(req.body);
  return res.status(201).json({ status: "success", data: result.rows[0] });
};

exports.listContacts = async (req, res) => {
  const result = await contactModel.findAll();
  return res.json({ status: "success", data: result.rows });
};
