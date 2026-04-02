const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";
  const stack = process.env.NODE_ENV === "production" ? undefined : err.stack;

  logger.error("Unhandled error", {
    status,
    message,
    path: req.originalUrl,
    method: req.method,
    stack,
  });

  return res.status(status).json({
    status: "error",
    message,
    errors: err.errors || null,
    stack,
  });
};
