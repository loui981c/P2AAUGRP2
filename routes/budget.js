var express = require('express');
var router = express.Router();
const budgetSchema = require("../schemas/budgetSchema");
const Transaction = require("../schemas/transactionSchema");

/* GET budget page. */
router.get('/', function (req, res, next) {

    //fetch transactions from database
    Transaction.find((err, trans) => {
        if (!err) {
            //array of all the categories. This will be used for calculating budget data
            //we have some prefixed categories
            let tempCategories = ["Rent", "Savings", "Food", "Income", "Subs", "Fun", "Misc."]

            //if any other category is found, add it to the temp array
            for (let i = 0; i < trans.length; i++) {
                if (!tempCategories.includes(trans[i].mainCategory)) {
                    tempCategories.push(trans[i].mainCategory)
                }
            }
            console.log(tempCategories)

            //this is where the data found in the for loops below will be stored
            let budgetDataStuff = [];

            //find the amount spent on each category by iterating through each trans and summing up all .price values
            let catExpected = 5000;
            for (cat of tempCategories) {
                console.log(cat)
                let totalCatSpendage = 0;
                for (t of trans) {
                    if (t.mainCategory == cat) {

                        totalCatSpendage += t.price;
                    }
                    //now the total price of the cat is pushed into the budgetDataStuff array along with the category name, a dummy expected value
                }
                let catRemaining = catExpected - totalCatSpendage;
                budgetDataStuff.push({ category: cat, expected: catExpected, spent: totalCatSpendage, remaining: catRemaining })
                catExpected += 200;
            }
            console.log(budgetDataStuff);

            // sorts the categories
            budgetDataStuff.sort((a, b) => {
                if (a.category < b.category) { return -1; }
                if (a.category > b.category) { return 1; }
                else { return 0; }
            });

            res.render("budget", { budgetDataStuff: budgetDataStuff });
        };
    });
});

router.get('/add', (req, res) => {



    res.render("add_budget");
});

router.post('/add', (req, res) => {
    let newBudget = new budgetSchema(req.body);
    let alreadyExists = false;

    budgetSchema.find((err, budget) => {
        if (!err) {
            for (let i = 0; i < budget.length; i++){
                if (budget[i].category.toLowerCase() === newBudget.category.toLowerCase()) {
                    alreadyExists = true;
                }
            }

        if (!alreadyExists) {
            newBudget.save().then(item => {
                console.log("saved to database: " + newBudget);
            }).catch((err) => {
                res.status(400).send("something went wrong when saving to database");
            });
        } else {
            console.log("This category already exists.");
        }
    
        res.redirect('/budget');
        } 
    })
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