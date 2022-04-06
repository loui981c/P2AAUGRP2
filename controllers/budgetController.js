let Transaction = require('../schemas/transactionSchema');
let Budget = require('../schemas/budgetSchema');
let async = require('async');

exports.budgetOverview = function(req, res, next) {
    
    // fetching data from database parallel
    async.parallel({
        transactions: function(callback) {
            Transaction.find(callback);
        },
        budget: function(callback) {
            Budget.find(callback);
        }, 
    }, function(err, results) {
            if (err) { return next(err); }
            
            // sets the results from the callback functions
            let trans = results.transactions;
            let budget = results.budget;
            
            // array to save modified data in
            let dataStuff = [];
    
            // calculates the spent and remaining of each category and pushes it into dataStuff
            for (let i = 0; i < budget.length; i++) {
                let spendage = 0;
                for (t of trans) {
                    if (t.mainCategory === budget[i].category) {
                        spendage += t.price;
                    }
                }
                let remaining = budget[i].expected - spendage;
                dataStuff.push({category: budget[i].category, expected: budget[i].expected, spent: spendage, remaining: remaining});
            }

            // sorts the categories alphabetically 
            dataStuff.sort((a, b) => {
                if (a.category < b.category) {return -1; }
                if (a.category > b.category) {return 1; }
                return 0;
            });

            // render with the data from dataStuff
            res.render("budget", { dataStuff: dataStuff });
    });
};

exports.AddBudget = function(req, res) {
    // defining a new schema and boolean
    let newBudget = new Budget(req.body);
    let alreadyExists = false;

    // checks if a category name is already in data 
    Budget.find((err, budget) => {
        if (!err) {
            for (let i = 0; i < budget.length; i++){
                if (budget[i].category.toLowerCase() === newBudget.category.toLowerCase()) {
                    alreadyExists = true;
                }
            }
        }

        // not saving the data from user if a category is already existing 
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