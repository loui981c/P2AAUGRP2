let Transaction = require('../schemas/transactionSchema');
let Budget = require('../schemas/budgetSchema');
let async = require('async');

/*
exports.budgetOverview_get = function (req, res, next) {

    async.parallel({
        transaction_find: function(callback) { Transaction.find().exec(callback); },
        income_find: function(callback) { Income.find().exec(callback); },
        expense_find: function(callback) { Expense.find().exec(callback); },
    }, function (err, results) {
        if (err) { return next(err); }

        // storing data in variables from database
        let trans = results.transaction_find;
        let income = results.income_find;
        let expense = results.expense_find

        // adding prefixed categories when first time use 
        // income
        if (income.filter(e => e.category.toLowerCase() == "income").length == 0) {
            let incomeBudget = new Income({ category: "income", expected: 0, spent: 0, remaining: 0, colourInput: "#00FF00" });
            incomeBudget.save().then(item => {
                console.log("Saved to database: " + incomeBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        };
        // rent prefixed category
        if (expense.filter(e => e.category.toLowerCase() == "rent").length == 0) {
            let rentBudget = new Expense({ category: "rent", expected: 0, spent: 0, remaining: 0, colourInput: "#0B5394" });
            rentBudget.save().then(item => {
                console.log("Saved to database: " + rentBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        };
        // insurance prefixed category
        if (expense.filter(e => e.category.toLowerCase() == "insurance").length == 0) {
            let insuranceBudget = new Expense({ category: "insurance", expected: 0, spent: 0, remaining: 0, colourInput: "#FA7610" });
            insuranceBudget.save().then(item => {
                console.log("Saved to database: " + insuranceBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        };
        // DR licence prefixed category
        if (expense.filter(e => e.category.toLowerCase() == "tv license").length == 0) {
            let DRBudget = new Expense({ category: "tv license", expected: 0, spent: 0, remaining: 0, colourInput: "#AC50E1" });
            DRBudget.save().then(item => {
                console.log("Saved to database: " + DRBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        };
        // Books prefixed category
        if (expense.filter(e => e.category.toLowerCase() == "books").length == 0) {
            let BooksBudget = new Expense({ category: "books", expected: 0, spent: 0, remaining: 0, colourInput: "#005C5B" });
            BooksBudget.save().then(item => {
                console.log("Saved to database: " + BooksBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        };
        // Phone prefixed category
        if (expense.filter(e => e.category.toLowerCase() == "phone").length == 0) {
            let PhoneBudget = new Expense({ category: "phone", expected: 0, spent: 0, remaining: 0, colourInput: "#3C1179" });
            PhoneBudget.save().then(item => {
                console.log("Saved to database: " + PhoneBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        };
        // Food prefixed category
        if (expense.filter(e => e.category.toLowerCase() == "food").length == 0) {
            let FoodBudget = new Expense({ category: "food", expected: 0, spent: 0, remaining: 0, colourInput: "#F1C232" });
            FoodBudget.save().then(item => {
                console.log("Saved to database: " + FoodBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        };
        // Transport prefixed category
        if (expense.filter(e => e.category.toLowerCase() == "transport").length == 0) {
            let TransportBudget = new Expense({ category: "transport", expected: 0, spent: 0, remaining: 0, colourInput: "#20124D" });
            TransportBudget.save().then(item => {
                console.log("Saved to database: " + TransportBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        };
        // other prefixed category
        if (expense.filter(e => e.category.toLowerCase() == "other").length == 0) {
            let OtherBudget = new Expense({ category: "other", expected: 0, spent: 0, remaining: 0, colourInput: "#D5A6BD" });
            OtherBudget.save().then(item => {
                console.log("Saved to database: " + OtherBudget);
            }).catch((err) => {
                res.status(400).send("Something went wrong while saving to the database." + err);
            });
        };


        let totalExpected = 0;
        let totalIncome = 0;
        let totalSpent = 0;
        let totalRemaining = 0;

        let incomeData = [];
        // calculates the spent, remaining of each categories and push into budgetData 
        // start with income 
        for (let i = 0; i < income.length; i++) {
            let spent = 0;
            let remaining = 0;
            for (t of trans) {
                if (t.mainCategory.toLowerCase() === income[i].category.toLowerCase()) {
                    spent += t.price;
                }
            }
            remaining = income[i].expected - spent;
            // make list with data to render
            incomeData.push({category: income[i].category, expected: income[i].expected, spent: spent, 
                colourInput: income[i].colourInput, remaining: remaining});
            
            // update the income database with new spent and remaining
            let id = income[i]._id.toString();
            Income.findByIdAndUpdate(
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

            // calculate totalIncome and 
            totalIncome += income[i].spent;
        };

        let expenseData = [];
        // the expenses
        for (let i = 0; i < expense.length; i++) {
            spent = 0;
            remaining = 0;
            for (t of trans) {
                if (t.mainCategory.toLowerCase() === expense[i].category.toLowerCase()) {
                    spent += t.price;
                }
            }
            remaining = expense[i].expected - spent;
            expense.push({category: expense[i].category, expected: expense[i].expected, spent: spent, 
                colourInput: expense[i].colourInput, remaining: remaining});

            // updates the db with new values 
            let id = expense[i]._id;
            Expense.findByIdAndUpdate(
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

            // calculate totalSpent and totalExpected
            totalSpent += expense[i].spent;
            totalExpected += expense[i].expected;
        }
        // calculate totalRemaining 
        totalRemaining = totalIncome - totalSpent;

        // sort both categories in income and expense
        // sort income
        incomeData.sort((a, b) => {
            if (a.category > b.category) { return 1; }
            if (a.category < b.category) { return -1; }
            return 0;
        });
        // sort expense
        expenseData.sort((a, b) => {
            if (a.category > b.category) { return 1; }
            if (a.category < b.category) { return -1; }
            return 0;
        });


        // recommended expenses variable
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

        // make a list of the variables 
        let lowRecommendedArr = [lowRent, insurance, tv, books, phone, lowFood, lowTransport, lowOther];
        let highRecommendedArr = [highRent, insurance, tv, books, phone, highFood, highTransport, highOther];
        
        // the total of recommended
        let lowRecommended = 0;
        let highRecommended = 0;
        
        // procentage of recommended
        let lowRecommendedProcentage = [];
        let highRecommendedProcentage = [];

        // calculate for total recommended
        for (i = 0; i < lowRecommendedArr.length; i++) {
            
            lowRecommended += lowRecommendedArr[i];
            highRecommended += highRecommendedArr[i];
            
        }
        // calculate for procentage of recommended
        for (j = 0; j < lowRecommendedArr.length; j++) {
            
            lowRecommendedProcentage.push(Math.round((lowRecommendedArr[j]/lowRecommended)*100));
            highRecommendedProcentage.push(Math.round((highRecommendedArr[j]/highRecommended)*100));

        }

        // make list of recommended of the prefixed category
        // this is ugly and could be done better
        let prefixedCategories = [{prefixed: 'rent', low: lowRent, high: highRent, lowP: lowRecommendedProcentage[0], highP: highRecommendedProcentage[0]},
        {prefixed: 'insurance', low: insurance, high: insurance, highP: lowRecommendedProcentage[1], lowP: highRecommendedProcentage[1]},
        {prefixed: 'tv license', low: tv, high: tv, highP: lowRecommendedProcentage[2], lowP: highRecommendedProcentage[2]},
        {prefixed: 'books etc.', low: books, high: books, lowP: lowRecommendedProcentage[3], highP: highRecommendedProcentage[3]},
        {prefixed: 'phone', low: phone, high: phone, lowP: lowRecommendedProcentage[4], highP: highRecommendedProcentage[4]},
        {prefixed: 'food', low: lowFood, high: highFood, lowP: lowRecommendedProcentage[5], highP: highRecommendedProcentage[5]},
        {prefixed: 'transport', low: lowTransport, high: highTransport, lowP: lowRecommendedProcentage[6], highP: highRecommendedProcentage[6]},
        {prefixed: 'other', low: lowOther, high: highOther, lowP: highRecommendedProcentage[7], highP: lowRecommendedProcentage[7]}];

        // sort the recommended categories
        prefixedCategories.sort((a, b) => {
            if (a.prefixed > b.prefixed) { return 1; }
            if (a.prefixed < b.prefixed) { return -1; }
            return 0;
        });


        // variables for user spent in prefixed categories
        let expenseSpent_book = 0;
        let expenseSpent_food = 0;
        let expenseSpent_insurance = 0;
        let expenseSpent_other = 0;
        let expenseSpent_phone = 0;
        let expenseSpent_rent = 0;
        let expenseSpent_transport = 0;
        let expenseSpent_tv = 0;

        // total of the users spent in the prefixed categories
        let totalSpentExpense = 0;
        // filter out the prefixed categories in categories
        for (let i = 0; i < expense.length; i++) {
            switch (expense[i].category) {
                case 'rent':
                    totalSpentExpense += expense[i].spent; 
                    expenseSpent_rent += expense[i].spent;
                    break;
                case 'insurance':
                    totalSpentExpense += expense[i].spent; 
                    expenseSpent_insurance += expense[i].spent;
                    break;
                case 'tv license':
                    totalSpentExpense += expense[i].spent;
                    expenseSpent_tv += expense[i].spent; 
                    break;
                case 'books etc.':
                    totalSpentExpense += expense[i].spent; 
                    expenseSpent_book += expense[i];
                    break;
                case 'phone':
                    totalSpentExpense += expense[i].spent;
                    expenseSpent_phone += expense[i].spent; 
                    break;
                case 'food':
                    totalSpentExpense += expense[i].spent; 
                    expenseSpent_food += expense[i].spent;
                    break;
                case 'transport':
                    totalSpentExpense += expense[i].spent; 
                    expenseSpent_transport += expense[i].spent;
                    break;
                case 'other':
                    totalSpentExpense += expense[i].spent; 
                    expenseSpent_other += expense[i].spent;
                    break;
            }
            
        }

        // not pretty:/
        prefixedSpentArr = [];
        // makes an array with the spent and procentage in the users recommended categories
        let expenseProcentage_book = Math.round((expenseSpent_book/totalSpentExpense)*100);
        prefixedSpentArr.push({expenseSpent: expenseSpent_book, expenseProcentage: expenseProcentage_book});
        
        let expenseProcentage_food = Math.round((expenseSpent_food/totalSpentExpense)*100);
        prefixedSpentArr.push({expenseSpent: expenseSpent_food, expenseProcentage: expenseProcentage_food});

        let expenseProcentage_insurance = Math.round((expenseSpent_insurance/totalSpentExpense)*100);
        prefixedSpentArr.push({expenseSpent: expenseSpent_insurance, expenseProcentage: expenseProcentage_insurance});
        
        let expenseProcentage_other = Math.round((expenseSpent_other/totalSpentExpense)*100);
        prefixedSpentArr.push({expenseSpent: expenseSpent_other, expenseProcentage: expenseProcentage_other});
        
        let expenseProcentage_phone = Math.round((expenseSpent_phone/totalSpentExpense)*100);
        prefixedSpentArr.push({expenseSpent: expenseSpent_phone, expenseProcentage: expenseProcentage_phone});
        
        let expenseProcentage_rent = Math.round((expenseSpent_rent/totalSpentExpense)*100);
        prefixedSpentArr.push({expenseSpent: expenseSpent_rent, expenseProcentage: expenseProcentage_rent});
        
        let expenseProcentage_transport = Math.round((expenseSpent_transport/totalSpentExpense)*100);
        prefixedSpentArr.push({expenseSpent: expenseSpent_transport, expenseProcentage: expenseProcentage_transport});
        
        let expenseProcentage_tv = Math.round((expenseSpent_tv/totalSpentExpense)*100);
        prefixedSpentArr.push({expenseSpent: expenseSpent_tv, expenseProcentage: expenseProcentage_tv});
        
        // for the total table
        let procentOfIncome = Math.round((totalSpent/totalIncome)*100);
        let procentOfExpected = Math.round((totalSpent/totalExpected)*100);
        
        res.render("budget", { incomeData: incomeData, expenseData: expenseData, totalExpected: totalExpected, totalIncome: totalIncome, totalSpent: totalSpent, totalRemaining: totalRemaining, 
            procentOfIncome: procentOfIncome, procentOfExpected: procentOfExpected, prefixed: prefixedCategories, lowRecommended: lowRecommended, 
            highRecommended: highRecommended, prefixedSpentArr: prefixedSpentArr, totalSpentExpense: totalSpentExpense});
    });
};
*/

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
        if (budget.filter(e => e.category.toLowerCase() == "income").length == 0) {
            let incomeBudget = new Budget({income: true, category: "income", expected: 0, spent: 0, remaining: 0, colourInput: "#00FF00" });
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

        let budgetData = [];
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
            budgetData.push({_id: budget[i]._id, category: budget[i].category, expected: budget[i].expected, colourInput: budget[i].colourInput, spent: spent, 
            remaining: remaining});
            
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
                
            if (budget.filter(b => b.income == false))
            {
                totalSpent += budget[i].spent;
                totalExpected += budget[i].expected;
            }
            if (budget.filter(b => b.income == true)) 
            {
                totalIncome += budget[i].spent;
                totalAvailable += budget[i].spent;
            }  
        }
        totalRemaining = totalAvailable - totalSpent;
        
        // sorts the categories alphabetically 
        budget.sort((a, b) => {
            if (a.category > b.category) { return 1; }
            if (a.category < b.category) { return -1; }
            return 0;
        });
        
        // recommmended expenses
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


        // variables for user spent in prefixed categories
        let expenseSpent_book = 0;
        let expenseSpent_food = 0;
        let expenseSpent_insurance = 0;
        let expenseSpent_other = 0;
        let expenseSpent_phone = 0;
        let expenseSpent_rent = 0;
        let expenseSpent_transport = 0;
        let expenseSpent_tv = 0;

        // total of the users spent in the prefixed categories
        let totalSpentExpense = 0;
        // filter out the prefixed categories in categories
        for (let i = 0; i < budget.length; i++) {
            if (budget[i].income === false) {
                switch (budget[i].category) {
                    case 'rent':
                        totalSpentExpense += budget[i].spent; 
                        expenseSpent_rent += budget[i].spent;
                        break;
                    case 'insurance':
                        totalSpentExpense += budget[i].spent; 
                        expenseSpent_insurance += budget[i].spent;
                        break;
                    case 'tv license':
                        totalSpentExpense += budget[i].spent;
                        expenseSpent_tv += budget[i].spent; 
                        break;
                    case 'books':
                        totalSpentExpense += budget[i].spent; 
                        expenseSpent_book += budget[i].spent;
                        break;
                    case 'phone':
                        totalSpentExpense += budget[i].spent;
                        expenseSpent_phone += budget[i].spent; 
                        break;
                    case 'food':
                        totalSpentExpense += budget[i].spent; 
                        expenseSpent_food += budget[i].spent;
                        break;
                    case 'transport':
                        totalSpentExpense += budget[i].spent; 
                        expenseSpent_transport += budget[i].spent;
                        break;
                    default:
                        totalSpentExpense += budget[i].spent; 
                        expenseSpent_other += budget[i].spent;
                        break;
                }
            }
        }
        
        let expenseProcentage_book = 0;
        let expenseProcentage_food = 0;
        let expenseProcentage_insurance = 0;
        let expenseProcentage_other = 0;
        let expenseProcentage_phone = 0;
        let expenseProcentage_rent = 0;
        let expenseProcentage_transport = 0;
        let expenseProcentage_tv = 0;
        
        prefixedSpentArr = [];
        if (expenseSpent_book != 0) {
            expenseProcentage_book = Math.round((expenseSpent_book/totalSpentExpense)*100);
            prefixedSpentArr.push({expenseSpent: expenseSpent_book, expenseProcentage: expenseProcentage_book});
        }
        if (expenseSpent_food != 0) {
            expenseProcentage_food = Math.round((expenseSpent_food/totalSpentExpense)*100);
            prefixedSpentArr.push({expenseSpent: expenseSpent_food, expenseProcentage: expenseProcentage_food});
        }
        if (expenseSpent_insurance != 0) {
            expenseProcentage_insurance = Math.round((expenseSpent_insurance/totalSpentExpense)*100);
            prefixedSpentArr.push({expenseSpent: expenseSpent_insurance, expenseProcentage: expenseProcentage_insurance});
        } 
        if (expenseSpent_other != 0) {
            expenseProcentage_other = Math.round((expenseSpent_other/totalSpentExpense)*100);
            prefixedSpentArr.push({expenseSpent: expenseSpent_other, expenseProcentage: expenseProcentage_other});
        } 
        if (expenseSpent_phone != 0) {
            expenseProcentage_phone = Math.round((expenseSpent_phone/totalSpentExpense)*100);
            prefixedSpentArr.push({expenseSpent: expenseSpent_phone, expenseProcentage: expenseProcentage_phone});
        } 
        if (expenseSpent_rent != 0) {
            expenseProcentage_rent = Math.round((expenseSpent_rent/totalSpentExpense)*100);
            prefixedSpentArr.push({expenseSpent: expenseSpent_rent, expenseProcentage: expenseProcentage_rent});
        } 
        if (expenseSpent_transport != 0) {
            expenseProcentage_transport = Math.round((expenseSpent_transport/totalSpentExpense)*100);
            prefixedSpentArr.push({expenseSpent: expenseSpent_transport, expenseProcentage: expenseProcentage_transport});
        } 
        if (expenseSpent_tv != 0) {
            expenseProcentage_tv = Math.round((expenseSpent_tv/totalSpentExpense)*100);
            prefixedSpentArr.push({expenseSpent: expenseSpent_tv, expenseProcentage: expenseProcentage_tv});
        } else {
            prefixedSpentArr.push({expenseSpent: expenseSpent_book, expenseProcentage: 0});
            prefixedSpentArr.push({expenseSpent: expenseSpent_food, expenseProcentage: 0});
            prefixedSpentArr.push({expenseSpent: expenseSpent_insurance, expenseProcentage: 0});
            prefixedSpentArr.push({expenseSpent: expenseSpent_other, expenseProcentage: 0});
            prefixedSpentArr.push({expenseSpent: expenseSpent_phone, expenseProcentage: 0});
            prefixedSpentArr.push({expenseSpent: expenseSpent_rent, expenseProcentage: 0});
            prefixedSpentArr.push({expenseSpent: expenseSpent_transport, expenseProcentage: 0});
            prefixedSpentArr.push({expenseSpent: expenseSpent_tv, expenseProcentage: 0});
        }
            
        // for the total table
        let procentOfIncome = Math.round((totalSpent/totalIncome)*100);
        let procentOfExpected = Math.round((totalSpent/totalExpected)*100);
        
        res.render("budget", { budgetData: budgetData, totalExpected: totalExpected, totalIncome: totalIncome, totalSpent: totalSpent, totalRemaining: totalRemaining, 
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
    let income = false;
    if (body.income = "on") {
        income = true;
    }
    else{
        income = false;
    }

    
    console.log("checkboxbool: " +income);
    
    // defining a new schema and boolean
    let newBudget = new Budget({income: income, category: category, expected: expected, spent: 0, remaining: 0,});
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