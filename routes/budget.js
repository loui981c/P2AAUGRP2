var express = require('express');
var router = express.Router();
let budget_controller = require('../controllers/budgetController');

/* GET budget page. */
router.get('/', budget_controller.budgetOverview);

router.get('/add', (req, res) => {

    res.render("add_budget");
});

router.post('/add', budget_controller.AddBudget);

//for deleting 
router.post("/:id/delete", (req, res) => {
    console.log("hi")
    budgetSchema.findByIdAndRemove(req.params.id).then(b => {
        if (!b) {
            return res.status(404).send();
        }
        res.redirect("/budget");
    }).catch(err => {
        res.status(500).send(err);
    })
});

module.exports = router;