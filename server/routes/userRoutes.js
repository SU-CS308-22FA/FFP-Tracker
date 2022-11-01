const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createUser)
  .delete(usersController.deleteUser)
  .patch(usersController.updateUser);

router.route("/:id").get(usersController.getUserById);

router.route("editUser/:id").patch(usersController.updateUser);

module.exports = router;
