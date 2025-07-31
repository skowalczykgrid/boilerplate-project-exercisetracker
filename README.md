# Exercise Tracker

This is my solution for the Exercise Tracker project from freeCodeCamp's APIs and Microservices course.

## What it does

- You can create users
- You can add exercises for each user
- You can see all exercises for a user
- It saves everything in a database

## How to run it

1. Download the code and install stuff:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Go to http://localhost:3000 to see it working

## How to use the API

### Create a user

```bash
curl -X POST http://localhost:3000/api/users -d "username=john"
```

### Add an exercise

```bash
curl -X POST http://localhost:3000/api/users/1/exercises -d "description=running&duration=30"
```

### Get all exercises for a user

```bash
curl http://localhost:3000/api/users/1/logs
```

## API Endpoints

### Users

- `POST /api/users` - Create a user (send username)
- `GET /api/users` - Get all users

### Exercises

- `POST /api/users/:_id/exercises` - Add exercise (send description, duration, and optional date)
- `GET /api/users/:_id/logs` - Get user's exercises (can add ?from=date&to=date&limit=number)

## What I learned

- How to use Express.js
- Working with databases (SQLite)
- Making APIs that return JSON
- Handling form data
- Basic error handling

## Files in this project

```
index.js              # Main server file
src/
  controllers/         # Handle requests
  models/             # Database stuff
  routes/             # URL routes
  middleware/         # Validation
views/                # HTML page
database.db           # SQLite database
```

## Testing

I added some tests too:

```bash
npm test
```

## Error Handling

All errors return JSON with appropriate HTTP status codes:

- **400 Bad Request:** Validation errors, duplicate usernames, invalid data
- **404 Not Found:** User not found, invalid routes
- **500 Internal Server Error:** Database or server errors

Example error response:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "username",
      "message": "Username is required",
      "value": ""
    }
  ]
}
```

## Database Schema

### Users Table

- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `username` (TEXT NOT NULL UNIQUE)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

### Exercises Table

- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `user_id` (INTEGER NOT NULL, FOREIGN KEY)
- `description` (TEXT NOT NULL)
- `duration` (INTEGER NOT NULL)
- `date` (TEXT NOT NULL)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

## Project Structure

```
├── index.js                 # Main application entry point
├── database.db             # SQLite database file
├── src/
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # Route definitions
│   ├── middleware/        # Validation and error handling
│   └── utils/             # Utility functions
├── views/                 # Frontend HTML
└── public/               # Static assets
```

## Development

- **Database:** SQLite with better-sqlite3 (synchronous, ships with project)
- **Validation:** express-validator for input validation
- **Architecture:** MVC pattern with separation of concerns
- **Security:** Prepared statements prevent SQL injection
- **Testing:** Jest with Supertest for API testing

### Available Scripts

```bash
npm start      # Start the production server
npm run dev    # Start development server with auto-reload
npm test       # Run the test suite
```

### Environment Variables

Create a `.env` file in the root directory (optional):

```
PORT=3000
NODE_ENV=development
```

## Testing Examples

```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=john_doe"

# Add an exercise
curl -X POST http://localhost:3000/api/users/1/exercises \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "description=Running&duration=30&date=2025-07-31"

# Get exercise log with filters
curl "http://localhost:3000/api/users/1/logs?from=2025-07-01&to=2025-07-31&limit=10"
```

## Testing

This project includes comprehensive automated tests:

```bash
# Run all tests
npm test

# Run tests in watch mode (reruns when files change)
npx jest --watch

# Run tests with coverage report
npx jest --coverage
```

**Test Coverage:**

- ✅ User creation and retrieval
- ✅ Exercise creation with validation
- ✅ Exercise logs with filtering
- ✅ Error handling and edge cases
- ✅ Date validation and formatting

## Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Kill any existing Node.js processes
pkill -f "node index.js"
# Then restart the server
npm start
```

**Database issues:**

- The SQLite database is created automatically
- For testing, an in-memory database is used
- To reset the database, delete `database.db` and restart

**Installation problems:**

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```
