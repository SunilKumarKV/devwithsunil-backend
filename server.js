const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { port, corsOrigin } = require("./config");
const rateLimiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(helmet());
app.use(cors({ origin: corsOrigin }));
app.use(rateLimiter);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

const morganStream = {
  write: (message) => logger.info(message.trim()),
};

app.use(morgan("combined", { stream: morganStream }));

const indexRoute = require("./routes/index");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const courseRoutes = require("./routes/courses");
const contactRoutes = require("./routes/contact");
const newsletterRoutes = require("./routes/newsletter");
const blogRoutes = require("./routes/blog");

app.use("/api", indexRoute);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/blog", blogRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  res.status(404).json({ status: "error", message: "Not Found" });
});

app.use(errorHandler);

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", { reason: reason?.toString() });
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`DevWithSunil API running on port ${port}`);
  });
}

module.exports = app;
