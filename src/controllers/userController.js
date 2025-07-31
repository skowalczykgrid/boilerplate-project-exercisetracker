const User = require("../models/User");

class UserController {
  static async createUser(req, res, next) {
    try {
      const { username } = req.body;

      const user = User.create(username);

      res.status(201).json({
        username: user.username,
        _id: user.id,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const users = User.getAll();

      const formattedUsers = users.map((user) => ({
        _id: user.id,
        username: user.username,
      }));

      res.json(formattedUsers);
    } catch (error) {
      next(error);
    }
  }

  static async checkUserExists(req, res, next) {
    try {
      const userId = parseInt(req.params._id);

      if (!User.exists(userId)) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      req.userId = userId;
      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
