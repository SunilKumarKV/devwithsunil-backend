const { Pool } = require("pg");
const logger = require("../utils/logger");

const {
  DATABASE_URL,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
  NODE_ENV,
} = process.env;

let poolConfig;

if (DATABASE_URL) {
  // Use DATABASE_URL if provided
  poolConfig = {
    connectionString: DATABASE_URL,
    ssl: NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
} else {
  // Fallback to individual variables
  poolConfig = {
    host: DB_HOST,
    port: DB_PORT ? Number(DB_PORT) : 5432,
    database: DB_DATABASE,
    user: DB_USER,
    password: DB_PASSWORD,
    ssl: NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
}

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  logger.error("Unexpected Postgres client error", {
    message: err.message,
    code: err.code,
  });
});

pool.on("connect", () => {
  if (NODE_ENV === "production") {
    logger.info("Database connection established");
  }
});

module.exports = pool;
