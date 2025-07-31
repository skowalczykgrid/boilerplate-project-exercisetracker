const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./src/routes/users");
const exerciseRoutes = require("./src/routes/exercises");
const {
  errorHandler,
  notFoundHandler,
} = require("./src/middleware/errorHandler");

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use("/api/users", userRoutes);
app.use("/api/users", exerciseRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
}

module.exports = app;
