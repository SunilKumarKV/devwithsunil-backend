const formatDate = () => new Date().toISOString();

const formatMessage = (level, message, meta = {}) => {
  const base = {
    timestamp: formatDate(),
    level,
    message,
    ...meta,
  };
  return JSON.stringify(base);
};

module.exports = {
  info: (message, meta = {}) => {
    console.log(formatMessage("info", message, meta));
  },
  warn: (message, meta = {}) => {
    console.warn(formatMessage("warn", message, meta));
  },
  error: (message, meta = {}) => {
    console.error(formatMessage("error", message, meta));
  },
};
