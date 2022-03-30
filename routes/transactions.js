var express = require('express');
var router = express.Router();

const funMoney = [{main: "FunMoney", sub: "Beer", price: 1000, date: 1}, {main: "FunMoney", sub: "Pizza", price: 69, date: 4}, {main: "FunMoney", sub: "200 shots", price: 420, date: 6}]
const rent = [{main: "Rent", sub: "Beer", price: 1000, date: 2}, {main: "Rent", sub: "Pizza", price: 69, date: 3}, {main: "Rent", sub: "200 shots", price: 420, date: 5}]

let allTransactions = [{main: "FunMoney", sub: "Beer", price: 1000, date: 1}, {main: "FunMoney", sub: "Pizza", price: 69, date: 4}, {main: "FunMoney", sub: "200 shots", price: 420, date: 6}, {main: "Rent", sub: "Beer", price: 1000, date: 2}, {main: "Rent", sub: "Pizza", price: 69, date: 3}, {main: "Rent", sub: "200 shots", price: 420, date: 5}]




/* GET transaction page. */
router.get('/', function(req, res, next) {

  //get categories from transactions
  let categories = [];
  for(let i = 0; i<allTransactions.length; i++)
  {
    if(!categories.includes(allTransactions[i].main))
    {
      categories.push(allTransactions[i].main)
    }
  }
  
  res.render("transactions", {categories: categories, allTransactions: allTransactions});
});

module.exports = router;