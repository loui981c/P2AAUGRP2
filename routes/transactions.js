var express = require('express');
var router = express.Router();
var transaction_controller = require('../controllers/transactionController')
const Transaction = require("../schemas/transactionSchema")
const Budget = require("../schemas/budgetSchema")


/* GET transaction page. */
router.get('/', transaction_controller.transactionOverview_get);

router.get("/categories", (req, res) => {
})

router.post("/categories", transaction_controller.categories_post)

//CRUD from this point on

router.get("/add", transaction_controller.addTransactions_get);

router.post("/add", transaction_controller.addTransactions_post);

//for deleting 
router.post("/:id/delete", transaction_controller.deleteTransactions_post);

//for editing
router.get("/edit/:id", transaction_controller.edit_get);

//for editing
router.post("/edit/:id", transaction_controller.edit_post);

router.get("/add/income", transaction_controller.add_income_get);

router.get("/add/income", transaction_controller.add_income_post);

router.get("/add/expense", transaction_controller.add_expense_get);

router.get("/add/expense", transaction_controller.add_expense_post);

module.exports = router;

