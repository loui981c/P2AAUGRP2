var express = require('express');
var router = express.Router();

/* GET budget page. */
router.get('/', function(req, res, next) {

    const budgetPromise = budgetSchema.find()
    const transactionPromise = Transaction.find()

    //find bot budget and transaction in database
    Promise.all([budgetPromise, transactionPromise]).then(([budget, trans])=>{
        
    let prefixedCat = ["Rent", "Savings", "Food", "Income", "Subs", "Fun", "Misc."];

            //if prefixed cat does not exist in budget database, create default value and push in datastuff
            let dataStuff = [];
            for (p of prefixedCat)
            {
                let spendage = 0;
                let dummyExpected = 2000;
                if (budget.filter(e => e.category == p).length == 0)
                {
                    for (t of trans) {
                        if (t.mainCategory == p) {
                            spendage += t.price;
                        }
                    }
                    let remaining = dummyExpected - spendage;
                    dataStuff.push({category: p, expected: dummyExpected, spent: spendage, remaining: remaining});
                }
            }

                //calculate data for each category
                for (b of budget) {
                    let spendage = 0;
                    for (t of trans) {
                        if (t.mainCategory == b.category) {
                            spendage += t.price;
                        }
                    }
                    let remaining = b.expected - spendage;
                    dataStuff.push({category: b.category, expected: b.expected, spent: spendage, remaining: remaining});

                }
                console.log(dataStuff)
                res.render("budget", {budgetData: dataStuff});
    })
});

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