const express = require("express");
const router = express.Router();
const expensesController = require("../controllers/expensesController");

router.route("/").get(expensesController.getAllExpenses);

router
  .route("/:id")
  .get(expensesController.getExpenseById)
  .post(expensesController.createExpenseById)
  .patch(expensesController.updateExpenseById);

module.exports = router;
