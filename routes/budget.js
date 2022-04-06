let express = require('express');
const { all } = require('./transactions');
let router = express.Router();
const budgetSchema = require("../schemas/budgetSchema");
const Transaction = require("../schemas/transactionSchema");
let async = require('async');

/* GET budget page. */
router.get('/', function(req, res, next) {

    async.parallel({
        transactions: function(callback) {
            Transaction.find(callback);
        },
        budget: function(callback) {
            budgetSchema.find(callback);
        }, 
        function(err, results) {
            if (!err) {
                let trans = results.transactions;
                let budget = results.budget;

                let prefixedCat = ["Rent", "Savings", "Food", "Income", "Subs", "Fun", "Misc."];

                let dataStuff = [];
                
                if (budget.length <= prefixedCat.length)
                {
                    // lav til if statement hvis budget.length <= prefixedCat.length
                    for (cat of prefixedCat) {
                        let catExpected = 0;
                        let catSpent = 0;
                        let catRemaining = 0;
                        new budgetSchema.save({category: cat, expected: catExpected, spent: catSpent, remaining: catRemaining});
                    }
                }

                for (let i = 0; i < budget.length; i++) {
                    let spendage = 0;
                    for (t of trans) {
                        if (t.mainCategory.toLowerCase() === budget[i].category.toLowerCase()) {
                            spendage += t.price;
                        }
                    }
                    let remaining = budget[i].expected - spendage;
                    dataStuff.push({category: budget[i].category, expected: budget[i].expected, spent: spendage, remaining: remaining});
                }

                res.render("budgetVeeTwo", { budgetData: budgetData});
            }
        }
    });      
});

router.get('/add', (req, res) => {



    res.render("add_budget");
});

router.post('/add', (req, res) => {

    let budget = new budgetSchema(req.body);
    budget.save().then(item => {
        console.log("saved to database: " + budget);
    }).catch((err) => {
        res.status(400).send("something went wrong when saving to database");
    });
    res.redirect('/budget');
});

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