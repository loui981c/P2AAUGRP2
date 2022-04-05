var express = require('express');
const { all } = require('./transactions');
var router = express.Router();
const budgetSchema = require("../schemas/budgetSchema");

/* hardcoded categories */
let allCategories = [{category: 'Food', expected: 3000, spent: 1200, remaining: 0},
{category: 'Food', expected: 3000, spent: 1200, remaining: 0},
{category: 'Rent', expected: 4500, spent: 4500, remaining: 0},
{category: 'Fun Money', expected: 1000, spent: 300, remaining: 0},
{category: 'Beer', expected: 1000, spent: 300, remaining: 0},
{category: 'Beer', expected: 1000, spent: 7500, remaining: 0},
{category: 'Income', expected: 10000, spent: 10000, remaining: 0},
{category: 'Income', expected: 10000, spent: 10000, remaining: 0}];


/* GET budget page. */
router.get('/', function(req, res, next) {
    
    budgetSchema.find((err, budget) => {
        if (!err) 
        {
            
            // updating the remaining 
            for (let i = 0; i < budget.length; i++) {
                budget[i].remaining = budget[i].expected - budget[i].spent;
            }
            
            // getting the total remaining
            let remainingTotal = 0;
            for (let i = 0; i < budget.length; i++) {
                remainingTotal += budget[i].expected - budget[i].spent;
            }
            
            // adding income as pos and other spent as neg
            let spent = 0;
            for (let i = 0; i < budget.length; i++) {
                if (budget[i].category.toLowerCase() === 'income') {
                    spent += budget[i].spent;
                } else {    
                    spent -= budget[i].spent;
                }
            }
            
            let categories = [];
            let categoriesObjects = [];
            for(let i = 0; i<budget.length; i++) {
                if(!categories.includes(budget[i].category)) {
                    categories.push(budget[i].category);
                    categoriesObjects.push(budget[i]);
                }
            }

            // sorts the categories
            categoriesObjects.sort((a, b) => {
                if (a.category < b.category) { return -1; }
                if (a.category > b.category) { return 1; }
                else { return 0 ;}
            });

            res.render("budget", {categories: categoriesObjects, budgetData: budget, 
                totalRemaining: remainingTotal, totalSpent: spent});
        }
    })
});

router.get('/add', function(req, res, next) {

    

    res.render("add_budget");
});

module.exports = router;