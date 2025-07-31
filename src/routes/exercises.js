const express = require("express");
const router = express.Router();
const ExerciseController = require("../controllers/exerciseController");
const UserController = require("../controllers/userController");
const {
  validateCreateExercise,
  validateExerciseLogQuery,
} = require("../middleware/validation");

router.post(
  "/:_id/exercises",
  validateCreateExercise,
  UserController.checkUserExists,
  ExerciseController.createExercise
);

router.get(
  "/:_id/logs",
  validateExerciseLogQuery,
  UserController.checkUserExists,
  ExerciseController.getUserExerciseLog
);

module.exports = router;
