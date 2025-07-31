const Exercise = require("../models/Exercise");
const User = require("../models/User");
const { parseOrCurrentDate } = require("../utils/dateUtils");

class ExerciseController {
  static async createExercise(req, res, next) {
    try {
      const userId = req.userId;
      const { description, duration } = req.body;
      let { date } = req.body;

      date = parseOrCurrentDate(date);

      const exercise = Exercise.create(
        userId,
        description,
        parseInt(duration),
        date
      );

      const user = User.getById(userId);

      res.status(201).json({
        _id: user.id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString(),
        exerciseId: exercise.id,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserExerciseLog(req, res, next) {
    try {
      const userId = req.userId;
      const { from, to, limit } = req.query;

      const filterOptions = {};
      if (from) filterOptions.from = from;
      if (to) filterOptions.to = to;
      if (limit) filterOptions.limit = limit;

      const user = User.getById(userId);

      const exercises = Exercise.getByUserId(userId, filterOptions);

      const totalCount = Exercise.getCountByUserId(userId, { from, to });

      const formattedExercises = exercises.map((exercise) => ({
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString(),
      }));

      res.json({
        _id: user.id,
        username: user.username,
        count: totalCount,
        log: formattedExercises,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ExerciseController;
