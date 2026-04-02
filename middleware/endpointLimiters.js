const rateLimit = require("express-rate-limit");

exports.contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many contact submissions. Please try again in 1 hour.",
  },
  skipSuccessfulRequests: false,
});

exports.newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many subscription attempts. Please try again in 1 hour.",
  },
  skipSuccessfulRequests: true,
});
