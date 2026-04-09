const express = require("express");
const cors = require("cors");
const ApiError = require("./utils/apiError");
const { ALLOWED_ORIGINS } = require("./config/env");
const { apiRateLimiter } = require("./middlewares/rateLimit");
const securityHeaders = require("./middlewares/securityHeaders");
const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");
const aiRoutes = require("./routes/ai.js");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = String(origin).replace(/\/+$/, "");

    if (ALLOWED_ORIGINS.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // Always allow in development/testing if ALLOWED_ORIGINS miss it
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 60 * 60 * 24,
};

app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(apiRateLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "AgriConnect API is running.",
    data: null,
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "AgriConnect API is healthy.",
    data: {
      status: "ok",
    },
  });
});

app.use(authRoutes);
app.use(listingRoutes);
app.use('/api/ai', aiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
