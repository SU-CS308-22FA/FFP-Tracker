const express = require("express");
const router = express.Router();
const revenueController = require("../controllers/revenuesController");

router.route("/").get(revenueController.getAllRevenues);

router
  .route("/:id")
  .get(revenueController.getRevenueById)
  .post(revenueController.createRevenueById)
  .patch(revenueController.updateRevenueById);

module.exports = router;
