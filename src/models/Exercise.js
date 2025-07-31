const { db } = require("./database");

class Exercise {
  static create(userId, description, duration, date) {
    try {
      const stmt = db.prepare(`
        INSERT INTO exercises (user_id, description, duration, date) 
        VALUES (?, ?, ?, ?)
      `);
      const result = stmt.run(userId, description, duration, date);

      return {
        id: result.lastInsertRowid,
        user_id: userId,
        description: description,
        duration: duration,
        date: date,
      };
    } catch (error) {
      throw error;
    }
  }

  static getByUserId(userId, options = {}) {
    try {
      let query = `
        SELECT id, description, duration, date 
        FROM exercises 
        WHERE user_id = ?
      `;
      const params = [userId];

      if (options.from) {
        query += " AND date >= ?";
        params.push(options.from);
      }

      if (options.to) {
        query += " AND date <= ?";
        params.push(options.to);
      }

      query += " ORDER BY date DESC";

      if (options.limit) {
        query += " LIMIT ?";
        params.push(parseInt(options.limit));
      }

      const stmt = db.prepare(query);
      return stmt.all(...params);
    } catch (error) {
      throw error;
    }
  }

  static getCountByUserId(userId, options = {}) {
    try {
      let query = "SELECT COUNT(*) as count FROM exercises WHERE user_id = ?";
      const params = [userId];

      if (options.from) {
        query += " AND date >= ?";
        params.push(options.from);
      }

      if (options.to) {
        query += " AND date <= ?";
        params.push(options.to);
      }

      const stmt = db.prepare(query);
      const result = stmt.get(...params);
      return result.count;
    } catch (error) {
      throw error;
    }
  }

  static getById(id) {
    try {
      const stmt = db.prepare("SELECT * FROM exercises WHERE id = ?");
      return stmt.get(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Exercise;
