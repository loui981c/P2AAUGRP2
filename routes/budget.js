var express = require('express');
const { all } = require('./transactions');
var router = express.Router();
const budgetSchema = require("../schemas/budgetSchema");
const Transaction = require("../schemas/transactionSchema") 

/* hardcoded categories */
let allCategories = [{category: 'Food', expected: 3000, spent: 1200, remaining: 0},
{category: 'Rent', expected: 4500, spent: 4500, remaining: 0},
{category: 'Fun Money', expected: 1000, spent: 300, remaining: 0},
{category: 'Beer', expected: 1000, spent: 300, remaining: 0},
{category: 'Food', expected: 3000, spent: 1200, remaining: 0},
{category: 'Beer', expected: 1000, spent: 7500, remaining: 0},
{category: 'Income', expected: 10000, spent: 10000, remaining: 0},
{category: 'Income', expected: 10000, spent: 10000, remaining: 0}];

console.log(allCategories[1].category.toLowerCase())

/* GET budget page. */
router.get('/', function(req, res, next) {


     //fetch transactions from database
  Transaction.find((err, trans)=>{
    if(!err)
    {
        //array of all the categories. This will be used for calculating budget data
        //we have some prefixed categories
        let tempCategories = ["Rent", "Savings", "Food", "Income", "Subs", "Fun", "Misc."]

       //if any other category is found, add it to the temp array
        for(let i = 0; i<trans.length; i++)
        {
           if(!tempCategories.includes(trans[i].mainCategory))
          {
            tempCategories.push(trans[i].mainCategory)
          }
        }
        console.log(tempCategories)

        //this is where the data found in the for loops below will be stored
        let budgetDataStuff = [];
        
        //find the amount spent on each category by iterating through each trans and summing up all .price values
        let catExpected = 5000;
        for (cat of tempCategories){
            console.log(cat)
            let totalCatSpendage = 0;
            for (t of trans)
            {
                if (t.mainCategory == cat)
                {

                    totalCatSpendage += t.price;
                }
                //now the total price of the cat is pushed into the budgetDataStuff array along with the category name, a dummy expected value
            }
            
            let catRemaining = catExpected - totalCatSpendage;
            budgetDataStuff.push({category: cat, expected: catExpected, spent: totalCatSpendage, remaining: catRemaining})
            catExpected += 200;
        }
        console.log(budgetDataStuff);
    /*
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

    // getting the total remaining
    let remainingTotal = 0;
    for (let i = 0; i < allCategories.length; i++) {
        remainingTotal += allCategories[i].expected - allCategories[i].spent;
    }
    
    // adding income as pos and other spent as neg
    let spent = 0;
    for (let i = 0; i < allCategories.length; i++) {
        if (allCategories[i].category.toLowerCase() === 'income') {
            spent += allCategories[i].spent;
        } else {    
            spent -= allCategories[i].spent;
        }
    }

    // sorts the categories
    allCategories.sort((a, b) => {
        if (a.category < b.category) { return -1; }
        if (a.category > b.category) { return 1; }
        else { return 0 ;}
    });
    */

    // res.render("budget", {categories: categories, allCategories: allCategories, 
    //     totalRemaining: remainingTotal, totalSpent: spent});
    res.render("budgetVeeTwo", {budgetDataStuff: budgetDataStuff});
//end of transaction.find
    }
})
//
});

router.get('/add', function(req, res, next) {
    res.render("add_budget")
});

module.exports = router;