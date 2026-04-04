const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Required environment variables
const requiredVars = ["JWT_SECRET", "DATABASE_URL", "EMAIL_USER", "EMAIL_PASS"];

// Validate required variables
const missingVars = requiredVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error("\nPlease set these variables in your .env file");
  process.exit(1);
}

// Validate JWT_SECRET length
if (process.env.JWT_SECRET.length < 32) {
  console.error("❌ JWT_SECRET must be at least 32 characters long");
  console.error(`   Current length: ${process.env.JWT_SECRET.length}`);
  process.exit(1);
}

console.log("✅ Environment validation passed");

// Export validated environment variables
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};
