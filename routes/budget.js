var express = require('express');
var router = express.Router();
let budget_controller = require('../controllers/budgetController');
const Budget = require("../schemas/budgetSchema");
const { findById, findByIdAndUpdate, update } = require('../schemas/transactionSchema');
const Transaction = require("../schemas/transactionSchema")

/* GET budget page. */
router.get('/', budget_controller.budgetOverview_get);

router.get('/add', (req, res) => {
    res.render("add_budget");
});

router.post('/add', budget_controller.addBudget_post);

//for deleting 
router.post("/:id/delete", (req, res) => {
    Budget.findByIdAndRemove(req.params.id).then(b => {
        if (!b) {
            return res.status(404).send();
        }
        res.redirect("/budget");
    }).catch(err => {
        res.status(500).send(err);
    })
});

//get edit budget

router.get("/:id/edit", (req, res) => {

    Budget.findById(req.params.id, (err, budget) => {

        if (!err) {
            console.log(budget)
            res.render("budget_edit", { budget: budget })
        }

    })

})
router.post("/:id/edit", (req, res) => {
    //
    // //
    console.log(req.body)
    const budgetPromise = Budget.findByIdAndUpdate(req.params.id, req.body)
    const transactionPromise = Transaction.find();

    //update all categories that has old category to edited category
    updatePromise = Transaction.updateMany({mainCategory: req.body.old}, {mainCategory: req.body.category});
    Promise.all([budgetPromise, transactionPromise, updatePromise]).then(([budget, trans, u]) => {
            res.redirect("/budget")
    })
})

module.exports = router;
