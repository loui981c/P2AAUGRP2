let Transaction = require('../schemas/transactionSchema');
let Budget = require('../schemas/budgetSchema');
let Savings = require('../schemas/savingsSchema');
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
        if (err) { return next(console.log('SOMETHING WENT WITH ASYNC')); }

        // storing the results from database
        let trans = results.transactions;
        let budget = results.budget;


        //All these prefrixed categories should be created when initially. By wrapping all of the below 
        //in an if statement check if there are no categories in the database.
        //If there are no categories in the database, create the categories.
        if (budget.length === 0) {

            //add the category "income" if it does not exist in the database
            if (budget.filter(e => e.category.toLowerCase() == "su").length == 0) {
                let incomeBudget = new Budget({ income: true, category: "su", expected: 5500, spent: 0, remaining: 0, colourInput: "#00FF00" });
                incomeBudget.save().then(item => {
                    console.log("Saved to database: INCOME BUDGET");
                }).catch((err) => {
                    res.status(400).send("Something went wrong while saving to the database." + err);
                });
            }
            // rent prefixed category
            if (budget.filter(e => e.category.toLowerCase() == "rent").length == 0) {
                let rentBudget = new Budget({ income: false, category: "rent", expected: 3250, spent: 0, remaining: 0, colourInput: "#0B5394" });
                rentBudget.save().then(item => {
                    console.log("Saved to database: RENT BUDGET");
                }).catch((err) => {
                    res.status(400).send("Something went wrong while saving to the database." + err);
                });
            }
            // insurance prefixed category
            if (budget.filter(e => e.category.toLowerCase() == "insurance").length == 0) {
                let insuranceBudget = new Budget({ income: false, category: "insurance", expected: 200, spent: 0, remaining: 0, colourInput: "#FA7610" });
                insuranceBudget.save().then(item => {
                    console.log("Saved to database: INSURANCE BUDGET");
                }).catch((err) => {
                    res.status(400).send("Something went wrong while saving to the database." + err);
                });
            }
            // DR licence prefixed category
            if (budget.filter(e => e.category.toLowerCase() == "tv-license").length == 0) {
                let DRBudget = new Budget({ income: false, category: "tv-license", expected: 100, spent: 0, remaining: 0, colourInput: "#AC50E1" });
                DRBudget.save().then(item => {
                    console.log("Saved to database: DR BUDGET");
                }).catch((err) => {
                    res.status(400).send("Something went wrong while saving to the database." + err);
                });
            }
            // Books prefixed category
            if (budget.filter(e => e.category.toLowerCase() == "books").length == 0) {
                let BooksBudget = new Budget({ income: false, category: "books", expected: 150, spent: 0, remaining: 0, colourInput: "#005C5B" });
                BooksBudget.save().then(item => {
                    console.log("Saved to database: BOOKS BUDGET");
                }).catch((err) => {
                    res.status(400).send("Something went wrong while saving to the database." + err);
                });
            }
            // Phone prefixed category
            if (budget.filter(e => e.category.toLowerCase() == "phone").length == 0) {
                let PhoneBudget = new Budget({ income: false, category: "phone", expected: 150, spent: 0, remaining: 0, colourInput: "#3C1179" });
                PhoneBudget.save().then(item => {
                    console.log("Saved to database: PHONE BUDGET");
                }).catch((err) => {
                    res.status(400).send("Something went wrong while saving to the database." + err);
                });
            }
            // Food prefixed category
            if (budget.filter(e => e.category.toLowerCase() == "food").length == 0) {
                let FoodBudget = new Budget({ income: false, category: "food", expected: 2000, spent: 0, remaining: 0, colourInput: "#F1C232" });
                FoodBudget.save().then(item => {
                    console.log("Saved to database: FOOD BUDGET");
                }).catch((err) => {
                    res.status(400).send("Something went wrong while saving to the database." + err);
                });
            }
            // Transport prefixed category
            if (budget.filter(e => e.category.toLowerCase() == "transport").length == 0) {
                let TransportBudget = new Budget({ income: false, category: "transport", expected: 475, spent: 0, remaining: 0, colourInput: "#20124D" });
                TransportBudget.save().then(item => {
                    console.log("Saved to database: TRANSPORT BUDGET");
                }).catch((err) => {
                    res.status(400).send("Something went wrong while saving to the database." + err);
                });
            }
            // other prefixed category
            if (budget.filter(e => e.category.toLowerCase() == "other").length == 0) {
                let OtherBudget = new Budget({ income: false, category: "other", expected: 1750, spent: 0, remaining: 0, colourInput: "#D5A6BD" });
                OtherBudget.save().then(item => {
                    console.log("Saved to database: OTHER BUDGET");
                }).catch((err) => {
                    res.status(400).send("Something went wrong while saving to the database." + err);
                });
            }
            // return (deleted savings)
            if (budget.filter(e => e.category.toLowerCase() == "return").length == 0) {
                let returnBudget = new Budget({ income: true, category: "return", expected: 0, spent: 0, remaining: 0, colourInput: "#88fc03" });
                returnBudget.save().then(item => {
                    console.log("Saved to database: return");
                }).catch((err) => {
                    res.status(400).send("Something went wrong while saving to the database." + err);
                });
            }
        }

        // for the dropdown 
        let choices = ['income', 'savings'];

        // for the recommended table
        let expenseSpent_book = 0;
        let expenseSpent_food = 0;
        let expenseSpent_insurance = 0;
        let expenseSpent_other = 0;
        let expenseSpent_phone = 0;
        let expenseSpent_rent = 0;
        let expenseSpent_transport = 0;
        let expenseSpent_tv = 0;

        // to store data in 
        let yourBudgetForRecommendSpent = [];

        // for the total table
        let totalExpected = 0;
        let totalIncome = 0;
        let totalSpent = 0;
        let totalRemaining = 0;

        // calculates the spent, remaining of each categories and push into budgetData
        for (let i = 0; i < budget.length; i++) {
            let spent = 0;
            let remaining = 0;
            for (t of trans) {
                if (t.mainCategory.toLowerCase() == budget[i].category.toLowerCase()) {
                    spent += t.price;
                    console.log(t, spent)
                }
            }
            remaining = budget[i].expected - spent;

            // updates the database with values
            let id = budget[i].id;
            let update = {
                spent: spent,
                remaining: remaining
            }
            Budget.findByIdAndUpdate(id, update).exec(function (err, result) {
                if (err) {
                    res.send(console.log('SOMETHING WENT WITH UPDATE BUDGET IN FOR LOOP'));
                }
                else {
                    console.log('UPDATE BUDGET WENT WELL', i);
                }
            }
            );

            if (budget[i].income == false) {
                totalSpent += spent;
                totalExpected += budget[i].expected;

                switch (budget[i].category) {
                    case 'rent':
                        expenseSpent_rent += budget[i].expected;
                        break;
                    case 'insurance':
                        expenseSpent_insurance += budget[i].expected;
                        break;
                    case 'tv-license':
                        expenseSpent_tv += budget[i].expected;
                        break;
                    case 'books':
                        expenseSpent_book += budget[i].expected;
                        break;
                    case 'phone':
                        expenseSpent_phone += budget[i].expected;
                        break;
                    case 'food':
                        expenseSpent_food += budget[i].expected;
                        break;
                    case 'transport':
                        expenseSpent_transport += budget[i].expected;
                        break;
                    default:
                        expenseSpent_other += budget[i].expected;
                        break;
                }
            }
            if (budget[i].income == true) {
                totalIncome += spent;
            }
        }
        totalRemaining = totalExpected - totalSpent;

        let budgetData = [];
        for (let i = 0; i < budget.length; i++) {
            if (budget[i].income == false && !budget[i].category.toLowerCase().includes('savings')) {
                let spent = 0;
                let remaining = 0;
                for (t of trans) {
                    if (t.mainCategory.toLowerCase() == budget[i].category.toLowerCase()) {
                        spent += t.price;
                    }
                }
                remaining = budget[i].expected - spent;
                budgetData.push({
                    _id: budget[i].id, income: budget[i].income, category: budget[i].category, expected: budget[i].expected,
                    spent: spent, remaining: remaining
                });
            }
        }

        // for the total table
        let procentOfIncome = 0;
        if ((totalSpent - totalIncome) != 0 || (totalSpent + totalIncome) != 0) {
            procentOfIncome = Math.round(-1 * (totalSpent - totalIncome) / ((totalSpent + totalIncome) / 2) * 100);
        }

        yourBudgetForRecommendSpent.push({ category: 'rent', spent: expenseSpent_rent });
        yourBudgetForRecommendSpent.push({ category: 'insurance', spent: expenseSpent_insurance });
        yourBudgetForRecommendSpent.push({ category: 'tv-license', spent: expenseSpent_tv });
        yourBudgetForRecommendSpent.push({ category: 'books', spent: expenseSpent_book });
        yourBudgetForRecommendSpent.push({ category: 'phone', spent: expenseSpent_phone });
        yourBudgetForRecommendSpent.push({ category: 'food', spent: expenseSpent_food });
        yourBudgetForRecommendSpent.push({ category: 'transport', spent: expenseSpent_transport });
        yourBudgetForRecommendSpent.push({ category: 'other', spent: expenseSpent_other });

        // sorts the categories alphabetically 
        yourBudgetForRecommendSpent.sort((a, b) => {
            if (a.category > b.category) { return 1; }
            if (a.category < b.category) { return -1; }
            return 0;
        });

        // sorts the categories alphabetically 
        budgetData.sort((a, b) => {
            if (a.category > b.category) { return 1; }
            if (a.category < b.category) { return -1; }
            return 0;
        });

        // recommmended expenses
        let lowRent = 2500;
        let highRent = 4000;
        let rent = (lowRent + highRent) / 2;
        let insurance = 200;
        let tv = 100;
        let books = 150;
        let phone = 150;
        let lowFood = 1500;
        let highFood = 2500;
        let food = (lowFood + highFood) / 2;
        let lowTransport = 300;
        let highTransport = 650;
        let transport = (lowTransport + highTransport) / 2;
        let lowOther = 1500;
        let highOther = 2000;
        let other = (lowOther + highOther) / 2;

        let recommendedAmount = rent + insurance + tv + books + phone + food + transport + other;

        // recommended % 
        let expenseProcentage_rent = 0;
        let expenseProcentage_insurance = 0;
        let expenseProcentage_tv = 0;
        let expenseProcentage_book = 0;
        let expenseProcentage_phone = 0;
        let expenseProcentage_food = 0;
        let expenseProcentage_transport = 0;
        let expenseProcentage_other = 0;

        // for recommended amount 
        // order here matters 
        recAmount = [];
        for (let i = 0; i < yourBudgetForRecommendSpent.length; i++) {
            switch (yourBudgetForRecommendSpent[i].category) {
                case 'rent':
                    if (expenseSpent_rent != 0) {
                        expenseProcentage_rent = Math.round(-1 * (expenseSpent_rent - rent) / ((expenseSpent_rent + rent) / 2) * 100);
                        recAmount.push({ spent: rent, pro: expenseProcentage_rent });
                    } else {
                        recAmount.push({ spent: rent, pro: 0 });
                    }
                    break;
                case 'insurance':
                    if (expenseSpent_insurance != 0) {
                        expenseProcentage_insurance = Math.round(-1 * (expenseSpent_insurance - insurance) / ((expenseSpent_insurance + insurance) / 2) * 100);
                        recAmount.push({ spent: insurance, pro: expenseProcentage_insurance });
                    } else {
                        recAmount.push({ spent: insurance, pro: 0 });
                    }
                    break;
                case 'tv-license':
                    if (expenseSpent_tv != 0) {
                        expenseProcentage_tv = Math.round(-1 * (expenseSpent_tv - tv) / ((expenseSpent_tv + tv) / 2) * 100);
                        recAmount.push({ spent: tv, pro: expenseProcentage_tv });
                    } else {
                        recAmount.push({ spent: tv, pro: 0 });
                    }
                    break;
                case 'books':
                    if (expenseSpent_book != 0) {
                        expenseProcentage_book = Math.round(-1 * (expenseSpent_book - books) / ((expenseSpent_book + books) / 2) * 100);
                        recAmount.push({ spent: books, pro: expenseProcentage_book });
                    } else {
                        recAmount.push({ spent: books, pro: 0 });
                    }
                    break;
                case 'phone':
                    if (expenseSpent_phone != 0) {
                        expenseProcentage_phone = Math.round(-1 * (expenseSpent_phone - phone) / ((expenseSpent_phone + phone) / 2) * 100);
                        recAmount.push({ spent: phone, pro: expenseProcentage_phone });
                    } else {
                        recAmount.push({ spent: phone, pro: 0 });
                    }
                    break;
                case 'food':
                    if (expenseSpent_food != 0) {
                        expenseProcentage_food = Math.round(-1 * (expenseSpent_food - food) / ((expenseSpent_food + food) / 2) * 100);
                        recAmount.push({ spent: food, pro: expenseProcentage_food });
                    } else {
                        recAmount.push({ spent: food, pro: 0 });
                    }
                    break;
                case 'transport':
                    if (expenseSpent_transport != 0) {
                        expenseProcentage_transport = Math.round(-1 * (expenseSpent_transport - transport) / ((expenseSpent_transport + transport) / 2) * 100);
                        recAmount.push({ spent: transport, pro: expenseProcentage_transport });
                    } else {
                        recAmount.push({ spent: transport, pro: 0 });
                    }
                    break;
                case 'other':
                    if (expenseSpent_other != 0) {
                        expenseProcentage_other = Math.round(-1 * (expenseSpent_other - other) / ((expenseSpent_other + other) / 2) * 100);
                        recAmount.push({ spent: other, pro: expenseProcentage_other });
                    } else {
                        recAmount.push({ spent: other, pro: 0 });
                    }
                    break;
            }
        }

        res.render("budget", {
            budgetData: budgetData, totalExpected: totalExpected, totalIncome: totalIncome, totalSpent: totalSpent, totalRemaining: totalRemaining,
            procentOfIncome: procentOfIncome, yourBudgetForRecommendSpent: yourBudgetForRecommendSpent, recAmount: recAmount, budget: budget,
            recommendedAmount: recommendedAmount, choices: choices, currentChoice: 'expenses'
        });
    });
};

exports.budgetOverview_post = function (req, res, next) {

    // gets data from database
    async.parallel({
        transactions: function (callback) {
            Transaction.find(callback);
        },
        budget: function (callback) {
            Budget.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(console.log('SOMETHING WENT WITH ASYNC')); }

        // storing the results from database
        let trans = results.transactions;
        let budget = results.budget;

        // for the dropdown 
        let choices = ['income', 'savings'];

        // for the recommended table
        let expenseSpent_book = 0;
        let expenseSpent_food = 0;
        let expenseSpent_insurance = 0;
        let expenseSpent_other = 0;
        let expenseSpent_phone = 0;
        let expenseSpent_rent = 0;
        let expenseSpent_transport = 0;
        let expenseSpent_tv = 0;

        // to store data in 
        let yourBudgetForRecommendSpent = [];

        // for the total table
        let totalExpected = 0;
        let totalIncome = 0;
        let totalSpent = 0;

        // calculates the spent, remaining of each categories and push into budgetData
        for (let i = 0; i < budget.length; i++) {
            let spent = 0;
            let remaining = 0;
            for (t of trans) {
                if (t.mainCategory.toLowerCase() == budget[i].category.toLowerCase()) {
                    spent += t.price;
                }
            }
            remaining = budget[i].expected - spent;

            if (budget[i].income == false) {
                totalSpent += spent;
                totalExpected += budget[i].expected;

                switch (budget[i].category) {
                    case 'rent':
                        expenseSpent_rent += spent;
                        break;
                    case 'insurance':
                        expenseSpent_insurance += spent;
                        break;
                    case 'tv-license':
                        expenseSpent_tv += spent;
                        break;
                    case 'books':
                        expenseSpent_book += spent;
                        break;
                    case 'phone':
                        expenseSpent_phone += spent;
                        break;
                    case 'food':
                        expenseSpent_food += spent;
                        break;
                    case 'transport':
                        expenseSpent_transport += spent;
                        break;
                    default:
                        expenseSpent_other += spent;
                        break;
                }
            }
            if (budget[i].income == true) {
                totalIncome += spent;
            }
        }
        let totalRemaining = totalExpected - totalSpent;

        let budgetData = [];
        if (req.body.choices == "expenses") {
            for (let i = 0; i < budget.length; i++) {
                if (budget[i].income == false && !budget[i].category.toLowerCase().includes("savings")) {
                    let spent = 0;
                    let remaining = 0;
                    for (t of trans) {
                        if (t.mainCategory.toLowerCase() == budget[i].category.toLowerCase()) {
                            spent += t.price;
                        }
                        remaining = budget[i].expected - spent;
                    }
                    budgetData.push({
                        _id: budget[i].id, income: budget[i].income, category: budget[i].category, expected: budget[i].expected,
                        spent: spent, remaining: remaining
                    });
                }
            }
        }
        if (req.body.choices == "income") {
            for (let i = 0; i < budget.length; i++) {
                if (budget[i].income == true) {
                    let spent = 0;
                    let remaining = 0;
                    for (t of trans) {
                        if (t.mainCategory.toLowerCase() == budget[i].category.toLowerCase()) {
                            spent += t.price;
                        }
                        remaining = budget[i].expected - spent;
                    }
                    budgetData.push({
                        _id: budget[i].id, income: budget[i].income, category: budget[i].category, expected: budget[i].expected,
                        spent: spent, remaining: remaining
                    });
                }
            }
        }
        if (req.body.choices == "savings") {
            for (let i = 0; i < budget.length; i++) {
                if (budget[i].income == false && budget[i].category.toLowerCase().includes("savings")) {
                    let spent = 0;
                    let remaining = 0;
                    for (t of trans) {
                        if (t.mainCategory.toLowerCase() == budget[i].category.toLowerCase()) {
                            spent += t.price;
                        }
                        remaining = budget[i].expected - spent;
                    }
                    budgetData.push({
                        _id: budget[i].id, income: budget[i].income, category: budget[i].category, expected: budget[i].expected,
                        spent: spent, remaining: remaining
                    });
                }
            }
        }

        // for the total table
        let procentOfIncome = 0;
        if ((totalSpent - totalIncome) != 0 || (totalSpent + totalIncome) != 0) {
            procentOfIncome = Math.round(-1 * (totalSpent - totalIncome) / ((totalSpent + totalIncome) / 2) * 100);
        }

        yourBudgetForRecommendSpent.push({ category: 'rent', spent: expenseSpent_rent });
        yourBudgetForRecommendSpent.push({ category: 'insurance', spent: expenseSpent_insurance });
        yourBudgetForRecommendSpent.push({ category: 'tv-license', spent: expenseSpent_tv });
        yourBudgetForRecommendSpent.push({ category: 'books', spent: expenseSpent_book });
        yourBudgetForRecommendSpent.push({ category: 'phone', spent: expenseSpent_phone });
        yourBudgetForRecommendSpent.push({ category: 'food', spent: expenseSpent_food });
        yourBudgetForRecommendSpent.push({ category: 'transport', spent: expenseSpent_transport });
        yourBudgetForRecommendSpent.push({ category: 'other', spent: expenseSpent_other });

        // sorts the categories alphabetically 
        yourBudgetForRecommendSpent.sort((a, b) => {
            if (a.category > b.category) { return 1; }
            if (a.category < b.category) { return -1; }
            return 0;
        });

        // sorts the categories alphabetically 
        budgetData.sort((a, b) => {
            if (a.category > b.category) { return 1; }
            if (a.category < b.category) { return -1; }
            return 0;
        });

        // recommmended expenses
        let lowRent = 2500;
        let highRent = 4000;
        let rent = (lowRent + highRent) / 2;
        let insurance = 200;
        let tv = 100;
        let books = 150;
        let phone = 150;
        let lowFood = 1500;
        let highFood = 2500;
        let food = (lowFood + highFood) / 2;
        let lowTransport = 300;
        let highTransport = 650;
        let transport = (lowTransport + highTransport) / 2;
        let lowOther = 1500;
        let highOther = 2000;
        let other = (lowOther + highOther) / 2;

        let recommendedAmount = rent + insurance + tv + books + phone + food + transport + other;

        // recommended % 
        let expenseProcentage_rent = 0;
        let expenseProcentage_insurance = 0;
        let expenseProcentage_tv = 0;
        let expenseProcentage_book = 0;
        let expenseProcentage_phone = 0;
        let expenseProcentage_food = 0;
        let expenseProcentage_transport = 0;
        let expenseProcentage_other = 0;

        // for recommended amount 
        // order here matters 
        recAmount = [];
        for (let i = 0; i < yourBudgetForRecommendSpent.length; i++) {
            switch (yourBudgetForRecommendSpent[i].category) {
                case 'rent':
                    if (expenseSpent_rent != 0) {
                        expenseProcentage_rent = Math.round(-1 * (expenseSpent_rent - rent) / ((expenseSpent_rent + rent) / 2) * 100);
                        recAmount.push({ category: yourBudgetForRecommendSpent[i].category, spent: rent, pro: expenseProcentage_rent });
                    } else {
                        recAmount.push({ category: yourBudgetForRecommendSpent[i].category, spent: rent, pro: 0 });
                    }
                    break;
                case 'insurance':
                    if (expenseSpent_insurance != 0) {
                        expenseProcentage_insurance = Math.round(-1 * (expenseSpent_insurance - insurance) / ((expenseSpent_insurance + insurance) / 2) * 100);
                        recAmount.push({ category: yourBudgetForRecommendSpent[i].category, spent: insurance, pro: expenseProcentage_insurance });
                    } else {
                        recAmount.push({ category: yourBudgetForRecommendSpent[i].category, spent: insurance, pro: 0 });
                    }
                    break;
                case 'tv-license':
                    if (expenseSpent_tv != 0) {
                        expenseProcentage_tv = Math.round(-1 * (expenseSpent_tv - tv) / ((expenseSpent_tv + tv) / 2) * 100);
                        recAmount.push({ category: yourBudgetForRecommendSpent[i].category, spent: tv, pro: expenseProcentage_tv });
                    } else {
                        recAmount.push({ category: yourBudgetForRecommendSpent[i].category, spent: tv, pro: 0 });
                    }
                    break;
                case 'books':
                    if (expenseSpent_book != 0) {
                        expenseProcentage_book = Math.round(-1 * (expenseSpent_book - books) / ((expenseSpent_book + books) / 2) * 100);
                        recAmount.push({ category: yourBudgetForRecommendSpent[i].category, spent: books, pro: expenseProcentage_book });
                    } else {
                        recAmount.push({ category: yourBudgetForRecommendSpent[i].category, spent: books, pro: 0 });
                    }
                    break;
                case 'phone':
                    if (expenseSpent_phone != 0) {
                        expenseProcentage_phone = Math.round(-1 * (expenseSpent_phone - phone) / ((expenseSpent_phone + phone) / 2) * 100);
                        recAmount.push({ category: yourBudgetForRecommendSpent[i].category, spent: phone, pro: expenseProcentage_phone });
                    } else {
                        recAmount.push({ category: yourBudgetForRecommendSpent[i].category, spent: phone, pro: 0 });
                    }
                    break;
                case 'food':
                    if (expenseSpent_food != 0) {
                        expenseProcentage_food = Math.round(-1 * (expenseSpent_food - food) / ((expenseSpent_food + food) / 2) * 100);
                        recAmount.push({ category: yourBudgetForRecommendSpent[i].category, spent: food, pro: expenseProcentage_food });
                    } else {
                        recAmount.push({ category: yourBudgetForRecommendSpent[i].category, spent: food, pro: 0 });
                    }
                    break;
                case 'transport':
                    if (expenseSpent_transport != 0) {
                        expenseProcentage_transport = Math.round(-1 * (expenseSpent_transport - transport) / ((expenseSpent_transport + transport) / 2) * 100);
                        recAmount.push({ category: yourBudgetForRecommendSpent[i].category, spent: transport, pro: expenseProcentage_transport });
                    } else {
                        recAmount.push({ category: yourBudgetForRecommendSpent[i].category, spent: transport, pro: 0 });
                    }
                    break;
                case 'other':
                    if (expenseSpent_other != 0) {
                        expenseProcentage_other = Math.round(-1 * (expenseSpent_other - other) / ((expenseSpent_other + other) / 2) * 100);
                        recAmount.push({ category: yourBudgetForRecommendSpent[i].category, spent: other, pro: expenseProcentage_other });
                    } else {
                        recAmount.push({ category: yourBudgetForRecommendSpent[i].category, spent: other, pro: 0 });
                    }
                    break;
            }
        }

        console.log(budgetData)
        res.render("budget", {
            budgetData: budgetData, totalExpected: totalExpected, totalIncome: totalIncome, totalSpent: totalSpent, totalRemaining: totalRemaining,
            procentOfIncome: procentOfIncome, yourBudgetForRecommendSpent: yourBudgetForRecommendSpent, recAmount: recAmount, budget: budget,
            recommendedAmount: recommendedAmount, choices: choices, currentChoice: req.body.choices,
        });

    });
};

exports.add_budget_get = function (req, res) {
    res.render("add_budget");
};

exports.addBudget_post = function (req, res) {
    // dividing the input from req.body
    let body = req.body;
    let category = body.category.split(' ').join('-').toLowerCase(); // Replace space + lowercase
    let expected = body.expected;
    let income = req.body.toggleValue;
    let color = body.colourInput;

    console.log("checkboxbool: " + req.body.toggleValue);

    // defining a new schema and boolean
    let newBudget = new Budget({ income: income, category: category, expected: expected, spent: 0, remaining: 0, colourInput: color });
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
    console.log("edit success");

    async.parallel({
        budget_find: function (callback) { Budget.findById(req.params.id).exec(callback); }
    }, function (err, results) {
        if (err) { return next(console.log('SOMETHING WENT WRONG WITH GET EDIT')); }

        res.render("budget_edit", { budget: results.budget_find });
    });
};

exports.edit_budget_post = function (req, res, next) {
    let body = req.body;
    body.category = body.category.split(' ').join('-').toLowerCase(); // Replace space + lowercase see also async function
    console.log("updated in database:" + body)

    async.parallel({
        budget_find_and_update: function (callback) { Budget.findByIdAndUpdate(req.params.id, body).exec(callback); },
        transaction_find_and_update: function (callback) { Transaction.updateMany({ mainCategory: req.body.old }, { mainCategory: req.body.category }).exec(callback); },
        saving_find_and_update: function (callback) { Savings.findOneAndUpdate({ name: req.body.old }, { name: body.category, epm: body.expected }).exec(callback); },
    }, function (err, results) {
        if (err) { return next(console.log('SOMETHING WENT WITH POST EDIT')); }

        let budget = results.budget_find_and_update;

        let remaining = 0;

        remaining = budget.expected - budget.spent;

        Budget.findByIdAndUpdate(
            req.params.id,
            {
                $set:
                {
                    remaining: remaining
                }
            }).exec(function (err, result) {
                if (err) {
                    res.send(console.log('SOMETHING WENT WRONG WITH UPDATE IN EDIT POST'));
                }
                else {
                    console.log(result);
                }
            }
            );
        res.redirect("/budget");
    });
};

exports.delete_budget_post = function (req, res, next) {

    async.parallel({
        budget_find_id: function (callback) { Budget.findByIdAndRemove(req.params.id).exec(callback); },
        transaction_find_many: function (callback) { Transaction.deleteMany({ mainCategory: req.body.category }).exec(callback); },
        savings_find: function (callback) { Savings.findOneAndDelete({ name: req.body.category }).exec(callback); },
    }, function (err, results) {
        if (err) { return next(console.log('SOMETHING WENT WRONG IN BUDGET DELETE')); }

        console.log('-------------------------', results.budget_find_id.category)

        res.redirect('/budget');
    });
};