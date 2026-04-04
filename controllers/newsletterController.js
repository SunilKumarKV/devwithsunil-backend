const { validationResult } = require("express-validator");
const subscriberModel = require("../models/subscriberModel");
const { sendNewsletterWelcome } = require("../utils/mailer");
const logger = require("../utils/logger");

exports.subscribe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    // Check for duplicate email subscriptions
    const existing = await subscriberModel.findByEmail(email);
    if (existing.rows.length) {
      return res.status(409).json({
        status: "error",
        message: "Email already subscribed",
      });
    }

    const result = await subscriberModel.create(email);

    // Send welcome email asynchronously - don't fail the subscription if email fails
    sendNewsletterWelcome(email)
      .then((info) => {
        logger.info("Newsletter welcome email sent", {
          messageId: info.messageId,
          emailTo: email,
        });
      })
      .catch((err) => {
        logger.error("Failed to send newsletter welcome email", {
          error: err.message,
          email: email,
          stack: err.stack,
        });
        // Note: We don't return an error here as the subscription was successful
      });

    return res.status(201).json({
      status: "success",
      data: result.rows[0],
      message: "Successfully subscribed to newsletter",
    });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const result = await subscriberModel.findAll();
    return res.json({ status: "success", data: result.rows });
  } catch (err) {
    next(err);
  }
};
