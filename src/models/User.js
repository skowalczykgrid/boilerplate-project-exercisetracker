const { db } = require("./database");

class User {
  static create(username) {
    try {
      const stmt = db.prepare("INSERT INTO users (username) VALUES (?)");
      const result = stmt.run(username);

      return {
        id: result.lastInsertRowid,
        username: username,
      };
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        const customError = new Error("Username already exists");
        customError.statusCode = 400;
        throw customError;
      }
      throw error;
    }
  }

  static getAll() {
    try {
      const stmt = db.prepare("SELECT id, username FROM users ORDER BY id");
      return stmt.all();
    } catch (error) {
      throw error;
    }
  }

  static getById(id) {
    try {
      const stmt = db.prepare("SELECT id, username FROM users WHERE id = ?");
      return stmt.get(id);
    } catch (error) {
      throw error;
    }
  }

  static exists(id) {
    try {
      const stmt = db.prepare("SELECT 1 FROM users WHERE id = ?");
      return !!stmt.get(id);
    } catch (error) {
      throw error;
    }
  }

  static getWithExerciseCount(id) {
    try {
      const stmt = db.prepare(`
        SELECT 
          u.id, 
          u.username,
          COUNT(e.id) as exercise_count
        FROM users u
        LEFT JOIN exercises e ON u.id = e.user_id
        WHERE u.id = ?
        GROUP BY u.id, u.username
      `);
      return stmt.get(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
