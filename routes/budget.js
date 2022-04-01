var express = require('express');
const { all } = require('./transactions');
var router = express.Router();
const budgetSchema = require("../schemas/budgetSchema");

/* hardcoded categories */
let allCategories = [{category: 'Food', expected: 3000, spent: 1200, remaining: 0},
{category: 'Rent', expected: 4500, spent: 4500, remaining: 0},
{category: 'Fun Money', expected: 1000, spent: 300, remaining: 0},
{category: 'Beer', expected: 1000, spent: 300, remaining: 0},
{category: 'Food', expected: 3000, spent: 1200, remaining: 0},
{category: 'Beer', expected: 1000, spent: 7500, remaining: 0},];

/* GET budget page. */
router.get('/', function(req, res, next) {
    
    // get categories from budget
    let categories = [];
    for (let i = 0; i < allCategories.length; i++) {
        if (!categories.includes(allCategories[i].category)) {
            categories.push(allCategories[i].category)
        }
    }

    // updating the remaining 
    for (let i = 0; i < allCategories.length; i++) {
        allCategories[i].remaining = allCategories[i].expected - allCategories[i].spent;
    }

    // getting the total remaining and spent
    let remainingTotal = 0;
    let spent = 0;
    for (let i = 0; i < allCategories.length; i++) {
        remainingTotal += allCategories[i].expected - allCategories[i].spent;
        spent += allCategories[i].spent;
    }

    // sorts the categories
    allCategories.sort((a, b) => {
        if (a.category < b.category) { return -1; }
        if (a.category > b.category) { return 1; }
        else { return 0 ;}
    });

    res.render("budget", {categories: categories, allCategories: allCategories, 
        totalRemaining: remainingTotal, totalSpent: spent});
});

router.get('/add', function(req, res, next) {
    res.render("add_budget")
});

module.exports = router;