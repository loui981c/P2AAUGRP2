let Transaction = require('../schemas/transactionSchema');
let Budget = require('../schemas/budgetSchema');
let async = require('async');
const { e } = require('mathjs');

exports.budgetOverview_get = function (req, res, next) {

    // gets data from database
    async.parallel({
        transactions: function (callback) {
            Transaction.find(callback);
        },
        budget: function (callback) {
            Budget.find(callback);
        },
        // shitty men virker
        budget_find_book: function (callback) { Budget.find({category: 'books'}).exec(callback); },
        budget_find_food: function (callback) { Budget.find({category: 'food'}).exec(callback); },
        budget_find_insurance: function (callback) { Budget.find({category: 'insurance'}).exec(callback); },
        budget_find_other: function (callback) { Budget.find({category: 'other'}).exec(callback); },
        budget_find_phone: function (callback) { Budget.find({category: 'phone'}).exec(callback); },
        budget_find_rent: function (callback) { Budget.find({category: 'rent'}).exec(callback); },
        budget_find_transport: function (callback) { Budget.find({category: 'transport'}).exec(callback); },
        budget_find_tv_license: function (callback) { Budget.find({category: 'tv license'}).exec(callback); },
    }, function (err, results) {
        if (err) { return next(err); }

        // storing the results from database
        let trans = results.transactions;
        let budget = results.budget;

        let bookDB = results.budget_find_book;
        let foodDB = results.budget_find_food;
        let insuranceDB = results.budget_find_insurance;
        let otherDB = results.budget_find_other;
        let phoneDB = results.budget_find_phone;
        let rentDB = results.budget_find_rent;
        let transportDB = results.budget_find_transport;
        let tvDB = results.budget_find_tv_license;

        //add the category "income" if it does not exist in the database
        if (budget.filter(e => e.category.toLowerCase() == "income").length == 0) {
            let incomeBudget = new Budget({ category: "income", expected: 0, spent: 0, remaining: 0, colourInput: "#00FF00" });
            incomeBudget.save().then(item => {
                console.log("Saved to database: " + incomeBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        }
        // rent prefixed category
        if (budget.filter(e => e.category.toLowerCase() == "rent").length == 0) {
            let rentBudget = new Budget({ category: "rent", expected: 0, spent: 0, remaining: 0, colourInput: "#0B5394" });
            rentBudget.save().then(item => {
                console.log("Saved to database: " + rentBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        }
        // insurance prefixed category
        if (budget.filter(e => e.category.toLowerCase() == "insurance").length == 0) {
            let insuranceBudget = new Budget({ category: "insurance", expected: 0, spent: 0, remaining: 0, colourInput: "#FA7610" });
            insuranceBudget.save().then(item => {
                console.log("Saved to database: " + insuranceBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        }
        // DR licence prefixed category
        if (budget.filter(e => e.category.toLowerCase() == "tv license").length == 0) {
            let DRBudget = new Budget({ category: "tv license", expected: 0, spent: 0, remaining: 0, colourInput: "#AC50E1" });
            DRBudget.save().then(item => {
                console.log("Saved to database: " + DRBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        }
        // Books prefixed category
        if (budget.filter(e => e.category.toLowerCase() == "books").length == 0) {
            let BooksBudget = new Budget({ category: "books", expected: 0, spent: 0, remaining: 0, colourInput: "#005C5B" });
            BooksBudget.save().then(item => {
                console.log("Saved to database: " + BooksBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        }
        // Phone prefixed category
        if (budget.filter(e => e.category.toLowerCase() == "phone").length == 0) {
            let PhoneBudget = new Budget({ category: "phone", expected: 0, spent: 0, remaining: 0, colourInput: "#3C1179" });
            PhoneBudget.save().then(item => {
                console.log("Saved to database: " + PhoneBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        }
        // Food prefixed category
        if (budget.filter(e => e.category.toLowerCase() == "food").length == 0) {
            let FoodBudget = new Budget({ category: "food", expected: 0, spent: 0, remaining: 0, colourInput: "#F1C232" });
            FoodBudget.save().then(item => {
                console.log("Saved to database: " + FoodBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        }
        // Transport prefixed category
        if (budget.filter(e => e.category.toLowerCase() == "transport").length == 0) {
            let TransportBudget = new Budget({ category: "transport", expected: 0, spent: 0, remaining: 0, colourInput: "#20124D" });
            TransportBudget.save().then(item => {
                console.log("Saved to database: " + TransportBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        }
        // other prefixed category
        if (budget.filter(e => e.category.toLowerCase() == "other").length == 0) {
            let OtherBudget = new Budget({ category: "other", expected: 0, spent: 0, remaining: 0, colourInput: "#D5A6BD" });
            OtherBudget.save().then(item => {
                console.log("Saved to database: " + OtherBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        }

        let totalExpected = 0;
        let totalIncome = 0;
        let totalSpent = 0;
        let totalRemaining = 0;
        let totalAvailable = 0;
        // calculates the spent, remaining of each categories and push into budgetData
        for (let i = 0; i < budget.length; i++) {
            let spent = 0;
            let remaining = 0;
            for (t of trans) {
                if (t.mainCategory.toLowerCase() === budget[i].category.toLowerCase()) {
                    spent += t.price;
                }
            }
            remaining = budget[i].expected - spent;
            
            // updates the database with values
            let id = budget[i]._id.toString();
            Budget.findByIdAndUpdate(
                {_id: id}, 
                { $set: 
                    {
                        spent: spent,
                        remaining: remaining
                    }
                }).exec(function(err, result) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        console.log(result);
                    }
                }
                );
                
                if (budget[i].category != "income")
            {
                totalSpent += budget[i].spent;
                totalExpected += budget[i].expected;
            }
            if (budget[i].category == "income") 
            {
                totalIncome = budget[i].spent;
                totalAvailable += budget[i].spent;
            }
            
            totalRemaining = totalAvailable - totalSpent;
        }
        
        // sorts the categories alphabetically 
        budget.sort((a, b) => {
            if (a.category > b.category) { return 1; }
            if (a.category < b.category) { return -1; }
            return 0;
        });
        
        let lowRent = 2500;
        let highRent = 4000;
        let insurance = 200;
        let tv = 100;
        let books = 150;
        let phone = 150;
        let lowFood = 1500;
        let highFood = 2500;
        let lowTransport = 300;
        let highTransport = 650;
        let lowOther = 1500;
        let highOther = 2000;
        
        let lowRecommendedArr = [lowRent, insurance, tv, books, phone, lowFood, lowTransport, lowOther];
        let highRecommendedArr = [highRent, insurance, tv, books, phone, highFood, highTransport, highOther];
        
        let lowRecommended = 0;
        let highRecommended = 0;
        
        let lowRecommendedProcentage = [];
        let highRecommendedProcentage = [];
        
        for (i = 0; i < lowRecommendedArr.length; i++) {
            
            lowRecommended += lowRecommendedArr[i];
            highRecommended += highRecommendedArr[i];
            
        }
        
        for (j = 0; j < lowRecommendedArr.length; j++) {
            
            lowRecommendedProcentage.push(Math.round((lowRecommendedArr[j]/lowRecommended)*100));
            highRecommendedProcentage.push(Math.round((highRecommendedArr[j]/highRecommended)*100));

        }
        
        // kunne gøres bedre
        let prefixedCategories = [{prefixed: 'rent', low: lowRent, high: highRent, lowP: lowRecommendedProcentage[0], highP: highRecommendedProcentage[0]},
        {prefixed: 'insurance', low: insurance, high: insurance, highP: lowRecommendedProcentage[1], lowP: highRecommendedProcentage[1]},
        {prefixed: 'tv license', low: tv, high: tv, highP: lowRecommendedProcentage[2], lowP: highRecommendedProcentage[2]},
        {prefixed: 'books etc.', low: books, high: books, lowP: lowRecommendedProcentage[3], highP: highRecommendedProcentage[3]},
        {prefixed: 'phone', low: phone, high: phone, lowP: lowRecommendedProcentage[4], highP: highRecommendedProcentage[4]},
        {prefixed: 'food', low: lowFood, high: highFood, lowP: lowRecommendedProcentage[5], highP: highRecommendedProcentage[5]},
        {prefixed: 'transport', low: lowTransport, high: highTransport, lowP: lowRecommendedProcentage[6], highP: highRecommendedProcentage[6]},
        {prefixed: 'other', low: lowOther, high: highOther, lowP: highRecommendedProcentage[7], highP: lowRecommendedProcentage[7]}];

        prefixedCategories.sort((a, b) => {
            if (a.prefixed > b.prefixed) { return 1; }
            if (a.prefixed < b.prefixed) { return -1; }
            return 0;
        });

        // not pretty:/
        let totalSpentExpense = bookDB[0].spent + foodDB[0].spent + insuranceDB[0].spent + otherDB[0].spent + phoneDB[0].spent + rentDB[0].spent + transportDB[0].spent + tvDB[0].spent;
        
        prefixedSpentArr = [];
        
        let expenseSpent_book = bookDB[0].spent;
        let expenseProcentage_book = Math.round((expenseSpent_book/totalSpentExpense)*100);
        prefixedSpentArr.push({expenseSpent: expenseSpent_book, expenseProcentage: expenseProcentage_book});
        
        let expenseSpent_food = foodDB[0].spent;
        let expenseProcentage_food = Math.round((expenseSpent_food/totalSpentExpense)*100);
        prefixedSpentArr.push({expenseSpent: expenseSpent_food, expenseProcentage: expenseProcentage_food});

        let expenseSpent_insurance = insuranceDB[0].spent;
        let expenseProcentage_insurance = Math.round((expenseSpent_insurance/totalSpentExpense)*100);
        prefixedSpentArr.push({expenseSpent: expenseSpent_insurance, expenseProcentage: expenseProcentage_insurance});
        
        let expenseSpent_other = otherDB[0].spent;
        let expenseProcentage_other = Math.round((expenseSpent_other/totalSpentExpense)*100);
        prefixedSpentArr.push({expenseSpent: expenseSpent_other, expenseProcentage: expenseProcentage_other});
        
        let expenseSpent_phone = phoneDB[0].spent;
        let expenseProcentage_phone = Math.round((expenseSpent_phone/totalSpentExpense)*100);
        prefixedSpentArr.push({expenseSpent: expenseSpent_phone, expenseProcentage: expenseProcentage_phone});
        
        let expenseSpent_rent = rentDB[0].spent;
        let expenseProcentage_rent = Math.round((expenseSpent_rent/totalSpentExpense)*100);
        prefixedSpentArr.push({expenseSpent: expenseSpent_rent, expenseProcentage: expenseProcentage_rent});
        
        let expenseSpent_transport = transportDB[0].spent;
        let expenseProcentage_transport = Math.round((expenseSpent_transport/totalSpentExpense)*100);
        prefixedSpentArr.push({expenseSpent: expenseSpent_transport, expenseProcentage: expenseProcentage_transport});
        
        let expenseSpent_tv = tvDB[0].spent;
        let expenseProcentage_tv = Math.round((expenseSpent_tv/totalSpentExpense)*100);
        prefixedSpentArr.push({expenseSpent: expenseSpent_tv, expenseProcentage: expenseProcentage_tv});
        
        let procentOfIncome = Math.round((totalSpent/totalIncome)*100);
        let procentOfExpected = Math.round((totalSpent/totalExpected)*100);
        
        res.render("budget", { budgetData: budget, totalExpected: totalExpected, totalIncome: totalIncome, totalSpent: totalSpent, totalRemaining: totalRemaining, 
            totalAvailable: totalAvailable, procentOfIncome: procentOfIncome, procentOfExpected: procentOfExpected, prefixed: prefixedCategories, lowRecommended: lowRecommended, 
            highRecommended: highRecommended, prefixedSpentArr: prefixedSpentArr, totalSpentExpense: totalSpentExpense});
    });
};

exports.add_budget_get = function (req, res) {
    res.render("add_budget");
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

exports.edit_budget_get = function (req, res, next) {
    
    async.parallel({
        budget_find: function (callback) { Budget.findById(req.params.id).exec(callback); }
    }, function (err, results) {
        if (err) { return next(err); }

        res.render("budget_edit", { budget: results.budget_find });
    });
};

exports.edit_budget_post = function (req, res, next) {

    async.parallel({
        budget_find_and_update: function (callback) { Budget.findByIdAndUpdate(req.params.id, req.body).exec(callback); },
        transaction_find_and_update: function (callback) { Transaction.updateMany({mainCategory: req.body.old}, {mainCategory: req.body.category}).exec(callback); },
        }, function (err, results) {
            if (err) { return next(err); }

            let budget = results.budget_find_and_update;

            let remaining = 0;

            remaining = budget.expected - budget.spent;

            Budget.findByIdAndUpdate( 
                req.params.id, 
                { $set: 
                    {
                        remaining: remaining
                    }
                }).exec(function(err, result) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        console.log(result);
                    }
                }
            );
            res.redirect("/budget");
    });
};

exports.delete_budget_post = function (res, req,) {

    Budget.findByIdAndRemove(req.params.id).then(b => {
        if (!b) {
            return res.status(404).send();
        }
        res.redirect("/budget");
    }).catch(err => {
        res.status(500).send(err);
    });
};