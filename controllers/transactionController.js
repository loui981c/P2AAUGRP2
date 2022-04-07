let Transaction = require('../schemas/transactionSchema');
let Budget = require('../schemas/budgetSchema');
let async = require('async');


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

        //last Day
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
        transactionsWithCorrectDates.sort((a, b) =>  b.date - a.date)
        console.log(transactionsWithCorrectDates);

        res.render("transactions", {firstDay: firstOutputDate, lastDay: lastOutPutDate, categories: categoriesFromBudget, allTransactions: transactionsWithCorrectDates, currentCategory: "AllCategories"});
    });
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

exports.addTransactions_post = function(req, res) {
    // saves data to database
    let transaction = new Transaction(req.body);
    transaction.save().then(item => {
        console.log("saved to database: "+ transaction)
      }).catch((err)=>{
        res.status(400).send("something went wrong when saving to database")
      });
    res.redirect("/transactions");
};

exports.deleteTransactions_post = function(req, res) {
    // delete data from database
    Transaction.findByIdAndRemove(req.params.id).then(t =>{
        if (!t)
        {
          return res.status(404).send()
        }
        res.redirect("/transactions")
        }).catch(err=>{
          res.status(500).send(err);
    });
};

exports.editTransactions_get = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id)

    //find current transaction and inputs it into the transactions_update view - this improves user experience
    async.parallel({
        transaction: function(callback) {
            Transaction.findById(id).exec(callback);
        },
        budget: function(callback) {
            Budget.find(callback);
        },
    }, function(err, results) {
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
        res.render('transactions_update', {transaction: results.transaction, categories: categoriesFromBudget});
    });
};

exports.editTransactions_post = function(req, res) {

    // finds id and updates
    Transaction.findByIdAndUpdate(req.params.id, req.body).then(t =>{
        if (!t)
        {
          return res.status(404).send()
        }
        res.redirect("/transactions")
    
      }).catch(err=>{
          res.status(500).send(err);
      });
};
