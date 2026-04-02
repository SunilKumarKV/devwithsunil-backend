const dotenv = require("dotenv");
const path = require("path");

const envResult = dotenv.config({ path: path.resolve(process.cwd(), ".env") });
if (envResult.error && process.env.NODE_ENV !== "production") {
  console.warn(".env file not found, relying on environment variables only.");
}

// Validate critical production environment variables
if (process.env.NODE_ENV === "production") {
  const requiredVars = [
    "JWT_SECRET",
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_DATABASE",
  ];
  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(
      `Missing critical environment variables in production: ${missing.join(", ")}`,
    );
  }
}

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "devwithsunil-secret-unsafe-default",
  jwtExpiration: process.env.JWT_EXPIRATION || "4h",
  appName: process.env.APP_NAME || "DevWithSunil",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};
