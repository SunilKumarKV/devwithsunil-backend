const { validationResult } = require("express-validator");
const xss = require("xss");
const contactMessageModel = require("../models/contactMessageModel");
const { sendContactNotification } = require("../utils/mailer");
const logger = require("../utils/logger");

exports.submit = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("Contact form validation failed", { errors: errors.array() });
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, email, message } = req.body;

    // Sanitize the message content
    const sanitizedMessage = xss(message);

    const result = await contactMessageModel.create({
      name,
      email,
      message: sanitizedMessage,
    });

    // Send notification email asynchronously
    sendContactNotification({ name, email, message: sanitizedMessage })
      .then((info) => {
        logger.info("Contact notification email sent", {
          messageId: info.messageId,
          emailTo: process.env.EMAIL_TO,
        });
      })
      .catch((err) => {
        logger.error("Failed to send contact notification email", {
          error: err.message,
          stack: err.stack,
        });
      });

    return res.status(201).json({ status: "success", data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const result = await contactMessageModel.findAll();
    return res.json({ status: "success", data: result.rows });
  } catch (err) {
    next(err);
  }
};
