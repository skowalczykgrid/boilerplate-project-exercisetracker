const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { validateCreateUser } = require("../middleware/validation");

router.post("/", validateCreateUser, UserController.createUser);

router.get("/", UserController.getAllUsers);

module.exports = router;
