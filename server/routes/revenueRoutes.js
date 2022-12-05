const express = require("express");
const router = express.Router();
const revenueController = require("../controllers/revenuesController");
const verifyJWT = require("../middleware/verifyJWT");

router.route("/").get(revenueController.getAllRevenues);

router
  .route("/:id")
  .get(revenueController.getRevenueById)
  .post(verifyJWT, revenueController.createRevenueById)
  .patch(verifyJWT, revenueController.updateRevenueById);

module.exports = router;
