var express = require('express');
var router = express.Router();
const Transaction = require("../schemas/transactionSchema") 

let categories = ["Rent", "Savings", "Food", "Income", "Subs", "Fun", "Misc.", "tobacco"];
/* GET transaction page. */
router.get('/', function(req, res, next) {

  //fetch transactions from database 
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

        //get first and last thay of the current month
          
          today = new Date();
          //first day
          todayMonth = today.getMonth() + 1;
          todayYear = today.getFullYear();
          firstDay = "01";

          if(todayMonth < 10){
              todayMonth = "0" + todayMonth;
          }
          firstOutputDate = todayYear + "-" + todayMonth + "-" + firstDay;

          //last Day
          lastDay = new Date(todayYear, todayMonth, 0);
          lastDay = lastDay.getDate();

          lastOutPutDate = todayYear + "-" + todayMonth + "-" + lastDay;
          
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
            if(correctDate.replaceAll("-", "") >= firstOutputDate.replaceAll("-", "") && correctDate.replaceAll("-", "") <= lastOutPutDate.replaceAll("-", ""))
            {
              transactionsWithCorrectDates.push(t);          

            }
          }
          console.log(transactionsWithCorrectDates);

      transactionsWithCorrectDates.sort((a, b) =>  b.date - a.date)
      res.render("transactions", {firstDay: firstOutputDate, lastDay: lastOutPutDate, categories: categories, allTransactions: transactionsWithCorrectDates, currentCategory: "AllCategories"});
    }
  })
});

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
router.get("/add", (req,res)=>{

  //categories from list of all transactions - this can be improved upon when actually using datebase

  res.render("transactions_add", {categories: categories});

})



router.post("/add", (req,res)=>{

  //create model from transactionSchema and save it in the database. 
  //Also: catch errors
  let transaction = new Transaction(req.body)
  transaction.save().then(item => {
    console.log("saved to database: "+ transaction)
  }).catch((err)=>{
    res.status(400).send("something went wrong when saving to database")
  })
  res.redirect("/transactions");
})

//for deleting 
router.post("/:id/delete", (req,res)=>{
  console.log("hi")
  Transaction.findByIdAndRemove(req.params.id).then(t =>{
    if (!t)
    {
      return res.status(404).send()
    }
    res.redirect("/transactions")

  }).catch(err=>{
      res.status(500).send(err);
  })
})


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
})

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
})


module.exports = router;