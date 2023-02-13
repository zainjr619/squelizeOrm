const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const userValidator = require("../validators/userValidator");

const router = express.Router();
const usersController = require("../controllers/usersController");

router.post(
  "/create",
  [userValidator.validateCreateUser],
  usersController.createUser
);

router.get("/list", [auth], usersController.usersList);
router.get("/:id", [auth], usersController.getUser);
router.delete("/:id", [auth], usersController.deleteUser);

router.post(
  "/change_password",
  [auth, userValidator.validateChangePassword],
  usersController.changeUserPassword
);

router.post("/login", userValidator.validateUserLogin, usersController.login);

module.exports = router;
