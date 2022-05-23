var express = require('express');
var router = express.Router();
var savingsController = require('../controllers/savingsController')
let Savings = require('../schemas/savingsSchema');
let Budget = require('../schemas/budgetSchema');
let Transaction = require('../schemas/transactionSchema');


router.post("/:id/delete", savingsController.savingsDelete_post)

router.get('/', savingsController.savingsOverview_get);

router.get('/add', savingsController.savingsAdd_get);

router.post('/add', savingsController.savingsAdd_post);

router.get("/:id/edit", savingsController.edit_get);

router.post("/:id/edit", savingsController.edit_post)

module.exports = router;


