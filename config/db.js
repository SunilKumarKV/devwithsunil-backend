const { Pool } = require("pg");
const logger = require("../utils/logger");

const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD, NODE_ENV } =
  process.env;

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT ? Number(DB_PORT) : 5432,
  database: DB_DATABASE,
  user: DB_USER,
  password: DB_PASSWORD,
  ssl: NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

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
