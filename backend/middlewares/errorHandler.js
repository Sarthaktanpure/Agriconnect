const multer = require("multer");
const ApiError = require("../utils/apiError");

function notFoundHandler(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, "NOT_FOUND"));
}

function errorHandler(error, _req, res, _next) {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Request body contains invalid JSON.",
      error: "INVALID_JSON",
    });
  }

  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "Image must be 5 MB or smaller."
      : error.message;

    return res.status(400).json({
      success: false,
      message,
      error: error.code,
    });
  }

  const normalizedMessage = error?.message?.toLowerCase?.() || "";

  if (normalizedMessage.includes("only image files are allowed")) {
    return res.status(400).json({
      success: false,
      message: "Only image files are allowed.",
      error: "INVALID_FILE_TYPE",
    });
  }

  if (normalizedMessage.includes("cloudinary")) {
    return res.status(500).json({
      success: false,
      message: "Image upload failed. Please check your Cloudinary configuration and try again.",
      error: "CLOUDINARY_UPLOAD_ERROR",
    });
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error.";
  const responseError = error.error || (statusCode >= 500 ? "INTERNAL_SERVER_ERROR" : null);

  return res.status(statusCode).json({
    success: false,
    message,
    error: responseError,
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
