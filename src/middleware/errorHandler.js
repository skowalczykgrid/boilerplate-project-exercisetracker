const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (process.env.NODE_ENV !== "test") {
    console.error("Error:", err);
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  if (err.code && err.code.startsWith("SQLITE_")) {
    switch (err.code) {
      case "SQLITE_CONSTRAINT_UNIQUE":
        return res.status(400).json({
          error: "Duplicate entry: this value already exists",
        });
      case "SQLITE_CONSTRAINT_FOREIGNKEY":
        return res.status(400).json({
          error: "Invalid reference: related record does not exist",
        });
      default:
        return res.status(500).json({
          error: "Database error occurred",
        });
    }
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      details: err.message,
    });
  }

  res.status(500).json({
    error: "Internal server error",
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
