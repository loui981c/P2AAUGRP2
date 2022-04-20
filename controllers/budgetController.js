let Transaction = require('../schemas/transactionSchema');
let Budget = require('../schemas/budgetSchema');
let async = require('async');

exports.budgetOverview_get = function (req, res, next) {

    // gets data from database
    async.parallel({
        transactions: function (callback) {
            Transaction.find(callback);
        },
        budget: function (callback) {
            Budget.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }

        // storing the results from database
        let trans = results.transactions;
        let budget = results.budget;

        //add the category "income" if it does not exist in the database
        if (budget.filter(e => e.category == "income").length == 0) {
            let incomeBudget = new Budget({ category: "income", expected: 0, spent: 0, remaining: 0, colourInput: "#00FF00" });
            incomeBudget.save();
            res.redirect('/budget');
        }

        // calculates the spent, remaining of each categories and push into budgetData
        for (let i = 0; i < budget.length; i++) {
            for (t of trans) {
                if (t.mainCategory.toLowerCase() === budget[i].category.toLowerCase()) {
                    budget[i].spent += t.price;
                }
            }
            budget[i].remaining = budget[i].expected - budget[i].spent;
        }

        // sorts the categories alphabetically 
        budget.sort((a, b) => {
            if (a.category > b.category) { return 1; }
            if (a.category < b.category) { return -1; }
            return 0;
        });

        res.render("budget", { budgetData: budget });
    });
};

exports.addBudget_post = function (req, res) {
    // dividing the input from req.body
    let body = req.body;
    let category = body.category;
    let expected = body.expected;
    
    // defining a new schema and boolean
    let newBudget = new Budget({category: category, expected: expected, spent: 0, remaining: 0});
    let alreadyExists = false;

    // checks if a category name is already in data 
    Budget.find((err, budget) => {
        if (!err) {
            for (let i = 0; i < budget.length; i++) {
                if (budget[i].category.toLowerCase() === newBudget.category.toLowerCase()) {
                    alreadyExists = true;
                }
            }
        }

        // not saving the data from user if a category  already exists
        if (!alreadyExists) {
            newBudget.save().then(item => {
                console.log("Saved to database: " + newBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        } else {
            console.log("This category already exists.");
        }  

        res.redirect('/budget');
    });
};