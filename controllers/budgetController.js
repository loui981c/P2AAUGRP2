let Transaction = require('../schemas/transactionSchema');
let Budget = require('../schemas/budgetSchema');
let async = require('async');

exports.budgetOverview = function(req, res, next) {

    async.parallel({
        transactions: function(callback) {
            Transaction.find(callback);
        },
        budget: function(callback) {
            Budget.find(callback);
        }, 
    }, function(err, results) {
            if (err) { return next(err); }
            
            let trans = results.transactions;
            let budget = results.budget;
            
            let dataStuff = [];
    
            for (let i = 0; i < budget.length; i++) {
                let spendage = 0;
                for (t of trans) {
                    if (t.mainCategory === budget[i].category) {
                        spendage += t.price;
                    }
                }
                let remaining = budget[i].expected - spendage;
                dataStuff.push({category: budget[i].category, expected: budget[i].expected, spent: spendage, remaining: remaining});
                console.log(dataStuff);
                console.log(i);
            }
            res.render("budget", { dataStuff: dataStuff });
    });
};

exports.AddBudget = function(req, res) {
    let newBudget = new Budget(req.body);
    let alreadyExists = false;

    Budget.find((err, budget) => {
        if (!err) {
            for (let i = 0; i < budget.length; i++){
                if (budget[i].category.toLowerCase() === newBudget.category.toLowerCase()) {
                    alreadyExists = true;
                }
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
    });
};