exports.success = (res, data = null, message = "Success", status = 200) => {
  return res.status(status).json({ status: "success", message, data });
};

exports.error = (
  res,
  message = "Server error",
  status = 500,
  errors = null,
) => {
  return res.status(status).json({ status: "error", message, errors });
};
