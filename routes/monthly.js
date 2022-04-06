var express = require('express');
var router = express.Router();
const Transaction = require("../schemas/transactionSchema") 

/* GET monthly overview page. */
router.get('/', function(req, res, next) {

  let categories = []
   //fetch transactions from database and identify categories
   Transaction.find((err, trans)=>{
    if(!err)
    {
      
       //categories from list of all fethced transactions
        for(let i = 0; i<trans.length; i++)
        {
           if(!categories.includes(trans[i].mainCategory))
          {
            categories.push(trans[i].mainCategory)
          }
        }
        console.log(categories)

        //iterate through each transaction, get all prices calculate sum of each category and create array with each 
        let sumOfPrices = []
        for(let l=0; l<categories.length; l++)
        {
          let sum = 0;
          for(let j=0; j<trans.length; j++)
          {
            if (categories[l] == trans[j].mainCategory)
            {
              sum+= trans[j].price;
            }

          }
          sumOfPrices.push(sum)
        }

        res.render("monthly", {categories: categories, sumOfPrices: sumOfPrices});
    }
  })

  
});

module.exports = router;
