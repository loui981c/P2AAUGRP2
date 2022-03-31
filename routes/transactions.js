var express = require('express');
const transactionSchema = require('../schemas/transactionSchema');
var router = express.Router();
const Transaction = require("../schemas/transactionSchema")

let categories = ["Fun Money", "Rent", "Savings", "Food"];
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
        console.log("categories")
        trans.sort((a, b) =>  b.date - a.date)
      res.render("transactions", {categories: categories, allTransactions: trans});
    }
  })

});

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
  res.redirect("/transactions")
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


//for updating
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

//for updating 
router.post("/edit/:id", (req,res)=>{

  Transaction.findByIdAndUpdate(req.params.id, req.body, {new: true}).then(t =>{
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