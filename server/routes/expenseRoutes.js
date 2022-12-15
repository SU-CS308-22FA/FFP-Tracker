const express = require("express");
const router = express.Router();
const expensesController = require("../controllers/expensesController");
const verifyJWT = require("../middleware/verifyJWT");

router.route("/").get(expensesController.getAllExpenses);

router
  .route("/:id")
  .get(expensesController.getExpenseById)
  .post(verifyJWT, expensesController.createExpenseById)
  .delete(verifyJWT, expensesController.deleteExpense)
  .patch(verifyJWT, expensesController.updateExpenseById);

module.exports = router;
