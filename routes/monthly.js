var express = require('express');
var router = express.Router();
const Transaction = require("../schemas/transactionSchema") 
const Budget = require("../schemas/budgetSchema")

/* GET monthly overview page. */
router.get('/', function(req, res, next) {

  let categoriesWithPricesAndColours = []
   //fetch transactions from database and identify categories
   const budgetPromise = Budget.find();
   const transactionPromise = Transaction.find();

   Promise.all([budgetPromise, transactionPromise]).then(([budgets, trans]) => {

      //go through each category. Sum up total spendage of each category. Add this data to categoriesWithPricesAndColours
      for (b of budgets){

          if(categoriesWithPricesAndColours.filter(e => e.category == b.category).length == 0)
          {
            let sum = 0;
            for (t of trans)
            {
              if (t.mainCategory == b.category)
              {
                sum += t.price
              }

            }
            categoriesWithPricesAndColours.push({category: b.category, colour: b.colourInput, amount: sum})
        }
      }
        //apparently the data needs to be in separate arrays for this to work. 
        //I tried with one whole object but because a workaround for exchanging serverside data with client side data, It was done this way
        let categories = []
        let prices = []
        let colours = []
        for (c of categoriesWithPricesAndColours)
        {
          categories.push(c.category)
          prices.push(c.amount)
          colours.push(c.colour)
        }

        console.log(categories)
        console.log(prices)
        console.log(colours)

        res.render("monthly", {categories: categories, prices: prices, colours: colours});
   })
});

module.exports = router;
