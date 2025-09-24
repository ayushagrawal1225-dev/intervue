const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Handle specific error types
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
      details: err.errors,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      error: "Invalid ID",
      message: "The provided ID is not valid",
    });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      error: "File Too Large",
      message: "The uploaded file is too large",
    });
  }

  // Handle JSON syntax errors
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "Invalid JSON",
      message: "Request body contains invalid JSON",
    });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong!"
      : err.message;

  res.status(statusCode).json({
    error: "Internal Server Error",
    message: message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
