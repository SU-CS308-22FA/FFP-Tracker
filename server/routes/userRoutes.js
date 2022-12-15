const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createUser);

router.route("/me").get(verifyJWT, usersController.getSingleUser);

router
  .route("/:id")
  .get(usersController.getUserById)
  .delete(verifyJWT, usersController.deleteUser)
  .patch(usersController.updateUser);

router.route("editUser/:id").patch(verifyJWT, usersController.updateUser);

module.exports = router;
