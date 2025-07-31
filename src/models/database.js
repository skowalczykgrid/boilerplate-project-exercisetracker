const Database = require("better-sqlite3");
const path = require("path");

const isTest = process.env.NODE_ENV === "test";
const dbPath = isTest ? ":memory:" : path.join(__dirname, "../../database.db");

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

function initializeDatabase() {
  try {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createExercisesTable = `
      CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        description TEXT NOT NULL,
        duration INTEGER NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    db.exec(createUsersTable);
    db.exec(createExercisesTable);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

function clearDatabase() {
  try {
    db.exec("DELETE FROM exercises");
    db.exec("DELETE FROM users");

    const sequenceExists = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='sqlite_sequence'"
      )
      .get();
    if (sequenceExists) {
      db.exec(
        'DELETE FROM sqlite_sequence WHERE name IN ("users", "exercises")'
      );
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error("Error clearing database:", error);
      throw error;
    }
  }
}

initializeDatabase();

module.exports = { db, clearDatabase };
