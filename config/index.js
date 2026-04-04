const dotenv = require("dotenv");
const path = require("path");

const envResult = dotenv.config({ path: path.resolve(process.cwd(), ".env") });
if (envResult.error && process.env.NODE_ENV !== "production") {
  console.warn(".env file not found, relying on environment variables only.");
}

// Environment validation is now handled in config/environment.js
// This file is required at server startup

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "devwithsunil-secret-unsafe-default",
  jwtExpiration: process.env.JWT_EXPIRATION || "4h",
  appName: process.env.APP_NAME || "DevWithSunil",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};
