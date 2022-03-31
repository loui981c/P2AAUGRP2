var express = require('express');
var router = express.Router();

/* used in transaction.ejs */
let allTransactions = [{main: "FunMoney", sub: "Beer", price: 1000, date: 3}, {main: "FunMoney", sub: "Pizza", price: 69, date: 4}, {main: "FunMoney", sub: "200 shots", price: 420, date: 6}, {main: "Rent", sub: "Beer", price: 1000, date: 2}, {main: "Rent", sub: "Pizza", price: 69, date: 1}, {main: "Rent", sub: "200 shots", price: 420, date: 5}]

//write to database

/* GET transaction page. */
router.get('/', function(req, res, next) {

  //categories from list of all transactions - this can be improved upon when actually using datebase
  let categories = [];
  for(let i = 0; i<allTransactions.length; i++)
  {
    if(!categories.includes(allTransactions[i].main))
    {
      categories.push(allTransactions[i].main)
    }
  }

  allTransactions.sort((a, b) => a.date - b.date)
  
  res.render("transactions", {categories: categories, allTransactions: allTransactions});
});

module.exports = router;

router.get("/add", (req,res)=>{

  //categories from list of all transactions - this can be improved upon when actually using datebase
  let categories = [];
  for(let i = 0; i<allTransactions.length; i++)
  {
    if(!categories.includes(allTransactions[i].main))
    {
      categories.push(allTransactions[i].main)
    }
  }

  res.render("transactions_add", {categories: categories});
})