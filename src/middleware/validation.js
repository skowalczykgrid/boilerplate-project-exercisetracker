const { body, param, query, validationResult } = require("express-validator");
const { isValidDateString, isValidDateRange } = require("../utils/dateUtils");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};

const validateCreateUser = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Username must be between 1 and 50 characters")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, periods, and hyphens"
    ),
  handleValidationErrors,
];

const validateCreateExercise = [
  param("_id")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 1, max: 500 })
    .withMessage("Description must be between 1 and 500 characters"),
  body("duration")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer (minutes)"),
  body("date")
    .optional()
    .custom((value) => {
      if (value && !isValidDateString(value)) {
        throw new Error("Date must be in YYYY-MM-DD format");
      }
      return true;
    }),
  handleValidationErrors,
];

const validateUserId = [
  param("_id")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),
  handleValidationErrors,
];

const validateExerciseLogQuery = [
  param("_id")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),
  query("from")
    .optional()
    .custom((value) => {
      if (value && !isValidDateString(value)) {
        throw new Error("From date must be in YYYY-MM-DD format");
      }
      return true;
    }),
  query("to")
    .optional()
    .custom((value) => {
      if (value && !isValidDateString(value)) {
        throw new Error("To date must be in YYYY-MM-DD format");
      }
      return true;
    }),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage("Limit must be a positive integer between 1 and 1000"),

  (req, res, next) => {
    const { from, to } = req.query;
    if (from && to && !isValidDateRange(from, to)) {
      return res.status(400).json({
        error:
          "Invalid date range: from date must be before or equal to to date",
      });
    }
    next();
  },
  handleValidationErrors,
];

module.exports = {
  validateCreateUser,
  validateCreateExercise,
  validateUserId,
  validateExerciseLogQuery,
  handleValidationErrors,
};
