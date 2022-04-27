let Transaction = require('../schemas/transactionSchema');
let Budget = require('../schemas/budgetSchema');
let async = require('async');

// display all transactions
exports.transactionOverview_get = function (req, res, next) {

  async.parallel({
    transactions: function (callback) {
      Transaction.find(callback);
    },
    budget: function (callback) {
      Budget.find(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }

    // getting the data from async function
    let trans = results.transactions;
    let budget = results.budget;

    let categoriesFromBudget = [];
    // gets the categories from budget
    for (let i = 0; i < budget.length; i++) {
      categoriesFromBudget.push(budget[i].category)
    }

    //get first and last day of the current month
    today = new Date();
    //first day
    todayMonth = today.getMonth() + 1;
    todayYear = today.getFullYear();
    firstDay = "01";

    if (todayMonth < 10) {
      todayMonth = "0" + todayMonth;
    }
    firstOutputDate = todayYear + "-" + todayMonth + "-" + firstDay;

    //last Day - the "0" in the month gives last day of month
    lastDay = new Date(todayYear, todayMonth, 0);
    lastDay = lastDay.getDate();

    lastOutPutDate = todayYear + "-" + todayMonth + "-" + lastDay;

    transactionsWithCorrectDates = [];
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
      if (correctDate.replaceAll("-", "") >= firstOutputDate.replaceAll("-", "") && correctDate.replaceAll("-", "") <= lastOutPutDate.replaceAll("-", "")) {
        transactionsWithCorrectDates.push(t);
      }
    }
    console.log(transactionsWithCorrectDates);

    // sorts the dates
    transactionsWithCorrectDates.sort((a, b) => b.date - a.date)
    console.log(transactionsWithCorrectDates);

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
          if (correctDate.replaceAll("-", "") >= firstOutputDate.replaceAll("-", "") && correctDate.replaceAll("-", "") <= lastOutPutDate.replaceAll("-", "")) {

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

    res.render("transactions", { mspent: mtotalSpent, mcategories: mcategories, mprices: mprices, mcolours: mcolours, firstDay: firstOutputDate, lastDay: lastOutPutDate, categories: categoriesFromBudget, allTransactions: transactionsWithCorrectDates, currentCategory: "AllCategories" });
  });
};

// choose dates and category to filter transactions
exports.transactionOverview_post = function (req, res, next) {
  const budgetPromise = Budget.find();
  const transactionPromise = Transaction.find();

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

      res.render("transactions", { mspent: mtotalSpent, mcategories: mcategories, mprices: mprices, mcolours: mcolours, firstDay: req.body.dateFrom, lastDay: req.body.dateTo, categories: categories, allTransactions: transactionsWithCorrectDates, currentCategory: req.body.categories })
    }
  })

};

exports.addTransactions_get = function (req, res, next) {
  async.parallel({
    budget: function (callback) {
      Budget.find(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }

    let budget = results.budget;

    // gets the categories from budget
    let categoriesFromBudget = [];
    for (let i = 0; i < budget.length; i++) {
      categoriesFromBudget.push(budget[i].category)
    }

    // sorts the array alphabetically
    categoriesFromBudget.sort()

    res.render("transactions_add", { categories: categoriesFromBudget });
  });
};

exports.addTransactions_post = function (req, res) {
  // saves data to database
  let transaction = new Transaction(req.body);
  transaction.save().then(item => {
    console.log("Saved to database: " + transaction)
  }).catch((err) => {
    res.status(400).send("Something went wrong while saving to the database.")
  });
  res.redirect("/transactions");
};

// delete the transaction
exports.deleteTransactions_post = function (req, res) {
  // delete data from database
  Transaction.findByIdAndRemove(req.params.id).then(t => {
    if (!t) {
      return res.status(404).send()
    }
    res.redirect("/transactions")
  }).catch(err => {
    res.status(500).send(err);
  });
};

// get the edit page
exports.editTransactions_get = function (req, res, next) {
  var id = mongoose.Types.ObjectId(req.params.id)

  //find current transaction and inputs it into the transactions_update view - this improves user experience
  async.parallel({
    transaction: function (callback) {
      Transaction.findById(id).exec(callback);
    },
    budget: function (callback) {
      Budget.find(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }
    if (results.transaction == null) {
      let err = new Error('Transaction not found');
      err.status = 404;
      return next(err);
    }

    let budget = results.budget

    let categoriesFromBudget = [];
    for (let i = 0; i < budget.length; i++) {
      categoriesFromBudget.push(budget[i].category)
    }
    res.render('transactions_update', { transaction: results.transaction, categories: categoriesFromBudget });
  });
};

// updates the edited transaction
exports.editTransactions_post = function (req, res) {

  // finds id and updates
  Transaction.findByIdAndUpdate(req.params.id, req.body).then(t => {
    if (!t) {
      return res.status(404).send()
    }
    res.redirect("/transactions")

  }).catch(err => {
    res.status(500).send(err);
  });
};
