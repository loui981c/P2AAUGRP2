var express = require('express');
var router = express.Router();
var transaction_controller = require('../controllers/transactionController')
const Transaction = require("../schemas/transactionSchema") 


let categories = ["Rent", "Savings", "Food", "Income", "Subs", "Fun", "Misc.", "tobacco"];

/* GET transaction page. */
router.get('/', transaction_controller.transactionOverview_get);

router.get("/categories", (req,res)=>{
})

router.post("/categories", (req,res)=>{
  
  globalStartDate = req.body.dateFrom;
  globalStartEnd = req.body.dateTo;
  if (req.body.categories == "AllCategories")
  {
    
    Transaction.find((err, trans)=>{
      if(!err)
      {
       
          transactionsWithCorrectDates = [];
  
          for(t of trans)
          {
            //convert format of transaction date to one that matches output dates
            tempDate =  t.date 
            tDay = tempDate.getDate();
            tMonth = tempDate.getMonth() + 1;
            tYear = tempDate.getFullYear();
  
            if (tDay < 10)
            {
              tDay = "0" + tDay
            }
            if (tMonth < 10)
            {
              tMonth = "0" + tMonth
            }
            correctDate = tYear + "-" + tMonth + "-" + tDay;;
  
            //add t to transactionsWithCorrectDates if it matches the first or last date of the current month
            if(correctDate.replaceAll("-", "") >= req.body.dateFrom.replaceAll("-", "") && correctDate.replaceAll("-", "") <= req.body.dateTo.replaceAll("-", ""))
            {
              transactionsWithCorrectDates.push(t);          
  
            }
          }
          console.log(transactionsWithCorrectDates);
  
        //
  
          transactionsWithCorrectDates.sort((a, b) =>  b.date - a.date)
          res.render("transactions", {firstDay: req.body.dateFrom, lastDay: req.body.dateTo, categories: categories, allTransactions: transactionsWithCorrectDates, currentCategory: req.body.categories})
      }
    })

  }
  else{

  //find categories withing the post above
  Transaction.find((err, trans)=>{
    if(!err)
    {
      let narrowedCategories = [];
      console.log(req.body)
      for (let i = 0; i<trans.length; i++)
      {
        if (trans[i].mainCategory == req.body.categories)
        {
            narrowedCategories.push(trans[i])
        }
      }
        transactionsWithCorrectDates = [];

        for(t of narrowedCategories)
        {
          //convert format of transaction date to one that matches output dates
          tempDate =  t.date 
          tDay = tempDate.getDate();
          tMonth = tempDate.getMonth() + 1;
          tYear = tempDate.getFullYear();

          if (tDay < 10)
          {
            tDay = "0" + tDay
          }
          if (tMonth < 10)
          {
            tMonth = "0" + tMonth
          }
          correctDate = tYear + "-" + tMonth + "-" + tDay;;

          //add t to transactionsWithCorrectDates if it matches the first or last date of the current month
          if(correctDate.replaceAll("-", "") >= req.body.dateFrom.replaceAll("-", "") && correctDate.replaceAll("-", "") <= req.body.dateTo.replaceAll("-", ""))
          {
            transactionsWithCorrectDates.push(t);          

          }
        }
        console.log(transactionsWithCorrectDates);

      //

        trans.sort((a, b) =>  b.date - a.date)
        res.render("transactions", {firstDay: req.body.dateFrom, lastDay: req.body.dateTo, categories: categories, allTransactions: transactionsWithCorrectDates, currentCategory: req.body.categories})
    }
  })
}
  
})

//CRUD from this point on
router.get("/add", transaction_controller.addTransactions_get);

router.post("/add", transaction_controller.addTransactions_post);

//for deleting 
router.post("/:id/delete", transaction_controller.deleteTransactions_post);

//for editing
router.get("/edit/:id", (req,res)=>{

  //find current transaction and inputs it into the transactions_update view - this improves user experience
  Transaction.findById(req.params.id).then(transToUpdate =>{
    if (!transToUpdate)
    {
      return res.status(404).send()
    }
    res.render("transactions_update", {transaction: transToUpdate, categories: categories})

  }).catch(err=>{
      res.status(500).send(err);
  })
});

//for editing
router.post("/edit/:id", (req,res)=>{

  Transaction.findByIdAndUpdate(req.params.id, req.body).then(t =>{
    if (!t)
    {
      return res.status(404).send()
    }
    res.redirect("/transactions")

  }).catch(err=>{
      res.status(500).send(err);
  })
});


module.exports = router;