var express = require('express');
var router = express.Router();
var transaction_controller = require('../controllers/transactionController')
const Transaction = require("../schemas/transactionSchema")
const Budget = require("../schemas/budgetSchema")


/* GET transaction page. */
router.get('/', transaction_controller.transactionOverview_get);

router.get("/categories", (req, res) => {
})

router.post("/categories", (req, res) => {

  const budgetPromise = Budget.find();
  const transactionPromise = Transaction.find()

  Promise.all([budgetPromise, transactionPromise]).then(([budget, trans]) => {

    //fetch all categories to choose from
    let categories = []
    for (b of budget) {
      categories.push(b.category)
    }

    //if category is AllCategories, then show all categories
    if (req.body.categories == "AllCategories") {
      transactionsWithCorrectDates = [];

      //iterate through all transactions convert date and them expamine date according to dateFrom and DateTo
      for (t of trans) {
        //convert format of transaction date to one that matches output dates
        tempDate = t.date
        tDay = tempDate.getDate();
        tMonth = tempDate.getMonth() + 1;
        tYear = tempDate.getFullYear();

        if (tDay < 10) {
          tDay = "0" + tDay
        }
        if (tMonth < 10) {
          tMonth = "0" + tMonth
        }
        correctDate = tYear + "-" + tMonth + "-" + tDay;;

        //add t to transactionsWithCorrectDates if it matches the first or last date of the current month
        if (correctDate.replaceAll("-", "") >= req.body.dateFrom.replaceAll("-", "") && correctDate.replaceAll("-", "") <= req.body.dateTo.replaceAll("-", "")) {
          transactionsWithCorrectDates.push(t);
        }
      }
      console.log(transactionsWithCorrectDates);
      //sort these transacions by date
      transactionsWithCorrectDates.sort((a, b) => b.date - a.date)

      console.log("all transactions with good dates: " + transactionsWithCorrectDates)

      //monthly stuff
      //monthly
      let categoriesWithPricesAndColours = [];
      for (b of budget) {

        if (categoriesWithPricesAndColours.filter(e => e.category == b.category).length == 0 && b.category != "income") {
          let sum = 0;
          //go through transactions and find correct dates.
          for (t of trans) {
            //dates
            tempDate = t.date
            tDay = tempDate.getDate();
            tMonth = tempDate.getMonth() + 1;
            tYear = tempDate.getFullYear(); 

            if (tDay < 10) {
              tDay = "0" + tDay
            }
            if (tMonth < 10) {
              tMonth = "0" + tMonth
            }

            correctDate = tYear + "-" + tMonth + "-" + tDay;;

            //add t to transactionsWithCorrectDates if it matches the first or last date of the current month
            if (correctDate.replaceAll("-", "") >= req.body.dateFrom.replaceAll("-", "") && correctDate.replaceAll("-", "") <= req.body.dateTo.replaceAll("-", "")) {

              if (t.mainCategory == b.category) {
                sum += t.price
              }
            }

          }
          if (sum > 0) {
            categoriesWithPricesAndColours.push({ category: b.category, colour: b.colourInput, amount: sum })
          }
        }
      }
      //apparently the data needs to be in separate arrays for this to work. 
      //I tried with one whole object but because a workaround for exchanging serverside data with client side data, It was done this way
      let mcategories = []
      let mprices = []
      let mcolours = []
      for (c of categoriesWithPricesAndColours) {
        mcategories.push(c.category)
        mprices.push(c.amount)
        mcolours.push(c.colour)
      }

      console.log(mcategories)
      console.log(mprices)
      console.log(mcolours)

      mtotalSpent = 0;
      for (c of categoriesWithPricesAndColours) {
        if (c.category !== 'income') {
          mtotalSpent += c.amount;
        }
      };
      //monthly

      //monthly stuff


      res.render("transactions", { mspent: mtotalSpent, mcategories: mcategories, mprices: mprices, mcolours: mcolours, firstDay: req.body.dateFrom, lastDay: req.body.dateTo, categories: categories, allTransactions: transactionsWithCorrectDates, currentCategory: req.body.categories })
    }
    //if category is anything else from all categories, do this
    else {
      let narrowedCategories = [];
      console.log(req.body)
      //add all categories to narrowedCategories if they match post request
      for (t of trans) {
        if (t.mainCategory == req.body.categories) {
          narrowedCategories.push(t)
        }
      }


      transactionsWithCorrectDates = [];
      for (t of narrowedCategories) {
        //convert format of transaction date to one that matches output dates
        tempDate = t.date
        tDay = tempDate.getDate();
        tMonth = tempDate.getMonth() + 1;
        tYear = tempDate.getFullYear();

        if (tDay < 10) {
          tDay = "0" + tDay
        }
        if (tMonth < 10) {
          tMonth = "0" + tMonth
        }
        correctDate = tYear + "-" + tMonth + "-" + tDay;;

        //add t to transactionsWithCorrectDates if it matches the first or last date of the current month
        if (correctDate.replaceAll("-", "") >= req.body.dateFrom.replaceAll("-", "") && correctDate.replaceAll("-", "") <= req.body.dateTo.replaceAll("-", "")) {
          transactionsWithCorrectDates.push(t);
        }
      }
      console.log(transactionsWithCorrectDates);

      //sort these transacions by date
      transactionsWithCorrectDates.sort((a, b) => b.date - a.date)
      console.log("all transactions with good dates: " + transactionsWithCorrectDates)

      //monthly
      //monthly
      let categoriesWithPricesAndColours = [];
      for (b of budget) {

        if (categoriesWithPricesAndColours.filter(e => e.category == b.category).length == 0 && b.category != "income") {
          let sum = 0;
          //go through transactions and find correct dates.
          for (t of trans) {
            //dates
            tempDate = t.date
            tDay = tempDate.getDate();
            tMonth = tempDate.getMonth() + 1;
            tYear = tempDate.getFullYear();

            if (tDay < 10) {
              tDay = "0" + tDay
            }
            if (tMonth < 10) {
              tMonth = "0" + tMonth
            }

            correctDate = tYear + "-" + tMonth + "-" + tDay;;

            //add t to transactionsWithCorrectDates if it matches the first or last date of the current month
            if (correctDate.replaceAll("-", "") >= req.body.dateFrom.replaceAll("-", "") && correctDate.replaceAll("-", "") <= req.body.dateTo.replaceAll("-", "")) {

              if (t.mainCategory == b.category) {
                sum += t.price
              }
            }

          }
          if (sum > 0) {
            categoriesWithPricesAndColours.push({ category: b.category, colour: b.colourInput, amount: sum })
          }
        }
      }
      //apparently the data needs to be in separate arrays for this to work. 
      //I tried with one whole object but because a workaround for exchanging serverside data with client side data, It was done this way
      let mcategories = []
      let mprices = []
      let mcolours = []
      for (c of categoriesWithPricesAndColours) {
        mcategories.push(c.category)
        mprices.push(c.amount)
        mcolours.push(c.colour)
      }

      console.log(mcategories)
      console.log(mprices)
      console.log(mcolours)

      mtotalSpent = 0;
      for (c of categoriesWithPricesAndColours) {
        if (c.category !== 'income') {
          mtotalSpent += c.amount;
        }
      };
      //monthly

      //monthly

      res.render("transactions", { mspent: mtotalSpent, mcategories: mcategories, mprices: mprices, mcolours: mcolours, firstDay: req.body.dateFrom, lastDay: req.body.dateTo, categories: categories, allTransactions: transactionsWithCorrectDates, currentCategory: req.body.categories })
    }
  })
})

//CRUD from this point on

router.get("/add", transaction_controller.addTransactions_get);

router.post("/add", transaction_controller.addTransactions_post);

//for deleting 
router.post("/:id/delete", transaction_controller.deleteTransactions_post);

//for editing
router.get("/edit/:id", (req, res) => {

  //find current transaction and inputs it into the transactions_update view - this improves user experience

  const budgetPromise = Budget.find();
  const transactionPromise = Transaction.findById(req.params.id)

  Promise.all([budgetPromise, transactionPromise]).then(([budget, trans]) => {

    let categories = []

    for (b of budget) {
      console.log(b)
      categories.push(b.category)
    }

    res.render("transactions_update", { transaction: trans, categories: categories })
  })
})

//for editing
router.post("/edit/:id", (req, res) => {

  Transaction.findByIdAndUpdate(req.params.id, req.body).then(t => {
    if (!t) {
      return res.status(404).send()
    }
    res.redirect("/transactions")

  }).catch(err => {
    res.status(500).send(err);
  })
});
/*
router.get("/add/income", transaction_controller.add_income_get);

router.get("/add/income", transaction_controller.add_income_post);

router.get("/add/expense", transaction_controller.add_expense_get);

router.get("/add/expense", transaction_controller.add_expense_post);
*/
module.exports = router;

