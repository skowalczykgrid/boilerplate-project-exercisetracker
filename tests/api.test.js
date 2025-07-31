const request = require("supertest");

process.env.NODE_ENV = "test";

const app = require("../index");
const { clearDatabase } = require("../src/models/database");

describe("Exercise Tracker API", () => {
  beforeEach(() => {
    clearDatabase();
  });

  describe("User endpoints", () => {
    test("POST /api/users should create a new user", async () => {
      const response = await request(app)
        .post("/api/users")
        .send({ username: "testuser123" })
        .expect(201);

      expect(response.body).toHaveProperty("username", "testuser123");
      expect(response.body).toHaveProperty("_id");
    });

    test("GET /api/users should return all users", async () => {
      await request(app).post("/api/users").send({ username: "testuser" });

      const response = await request(app).get("/api/users").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty("username", "testuser");
    });

    test("POST /api/users should return 400 for duplicate username", async () => {
      await request(app)
        .post("/api/users")
        .send({ username: "duplicate_test" });

      const response = await request(app)
        .post("/api/users")
        .send({ username: "duplicate_test" })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    test("POST /api/users should return 400 for invalid username", async () => {
      const response = await request(app)
        .post("/api/users")
        .send({ username: "" })
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Validation failed");
    });
  });

  describe("Exercise endpoints", () => {
    let userId;

    beforeEach(async () => {
      const userResponse = await request(app)
        .post("/api/users")
        .send({ username: "exercise_test_user" });
      userId = userResponse.body._id;
    });

    test("POST /api/users/:_id/exercises should create a new exercise", async () => {
      const response = await request(app)
        .post(`/api/users/${userId}/exercises`)
        .send({
          description: "Test exercise",
          duration: 30,
        })
        .expect(201);

      expect(response.body).toHaveProperty("description", "Test exercise");
      expect(response.body).toHaveProperty("duration", 30);
      expect(response.body).toHaveProperty("_id", userId);
      expect(response.body).toHaveProperty("date");
      expect(response.body).toHaveProperty("exerciseId");
    });

    test("POST /api/users/:_id/exercises should create exercise with custom date", async () => {
      const response = await request(app)
        .post(`/api/users/${userId}/exercises`)
        .send({
          description: "Test exercise with date",
          duration: 45,
          date: "2025-07-15",
        })
        .expect(201);

      expect(response.body).toHaveProperty(
        "description",
        "Test exercise with date"
      );
      expect(response.body).toHaveProperty("duration", 45);
      expect(response.body.date).toContain("Jul 15 2025");
    });

    test("GET /api/users/:_id/logs should return exercise log", async () => {
      await request(app).post(`/api/users/${userId}/exercises`).send({
        description: "Test exercise",
        duration: 30,
      });

      const response = await request(app)
        .get(`/api/users/${userId}/logs`)
        .expect(200);

      expect(response.body).toHaveProperty("_id", userId);
      expect(response.body).toHaveProperty("username", "exercise_test_user");
      expect(response.body).toHaveProperty("log");
      expect(response.body).toHaveProperty("count", 1);
      expect(Array.isArray(response.body.log)).toBe(true);
      expect(response.body.log).toHaveLength(1);
    });

    test("GET /api/users/:_id/logs with limit should limit results", async () => {
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post(`/api/users/${userId}/exercises`)
          .send({
            description: `Exercise ${i + 1}`,
            duration: 30,
          });
      }

      const response = await request(app)
        .get(`/api/users/${userId}/logs?limit=2`)
        .expect(200);

      expect(response.body.count).toBe(3);
      expect(response.body.log).toHaveLength(2);
    });

    test("POST /api/users/999/exercises should return 404 for non-existent user", async () => {
      const response = await request(app)
        .post("/api/users/999/exercises")
        .send({
          description: "Test exercise",
          duration: 30,
        })
        .expect(404);

      expect(response.body).toHaveProperty("error");
    });

    test("POST /api/users/:_id/exercises should return 400 for invalid data", async () => {
      const response = await request(app)
        .post(`/api/users/${userId}/exercises`)
        .send({
          description: "",
          duration: "invalid",
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Validation failed");
    });
  });
});
