var express = require('express');
var router = express.Router();
let budget_controller = require('../controllers/budgetController');

/* GET budget page. */
router.get('/', budget_controller.budgetOverview_get);

router.get("/choices", (req, res) => {
})

router.post("/choices", budget_controller.budgetOverview_post);

router.get('/add', budget_controller.add_budget_get);

router.post('/add', budget_controller.addBudget_post);

//get edit budget
router.get("/:id/edit", budget_controller.edit_budget_get);

router.post("/:id/edit", budget_controller.edit_budget_post);

router.post("/:id/delete", budget_controller.delete_budget_post);

module.exports = router;
