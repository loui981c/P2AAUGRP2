let Transaction = require('../schemas/transactionSchema');
let Budget = require('../schemas/budgetSchema');
let Savings = require('../schemas/savingsSchema');

exports.savingsOverview_get = function(req, res, next) {

    //variables to check if a savings has recently been deleted
    let internalRecentlyDeleted = false;
   console.log("recently deleted: " + req.app.locals.recentlyDeleted)
   if (req.app.locals.recentlyDeleted == "true") {
         internalRecentlyDeleted = true;
         req.app.locals.recentlyDeleted = "false";
    }

    console.log("internal recently deleted: " + internalRecentlyDeleted)


    const savingPromise = Savings.find()
    const transactionPromise = Transaction.find()
  
    Promise.all([savingPromise, transactionPromise]).then(([saving, trans]) => {

        let dataForPage = [];
        //add spent from budget to savingPromise (as progress)
       for (s of saving)
       {
           let totalSpent = 0;
              for (t of trans)
              {
                if (s.name == t.mainCategory)
                {
                    totalSpent += t.price
                }
             
            }
            dataForPage.push({
                name: s.name,
                img : s.img,
                amount: s.amount,
                epm: s.epm,
                progress: totalSpent,
                colourInput: s.colourInput,
                _id: s._id,})
       }
         res.render("savings", {sg: dataForPage, recentlyDeleted: internalRecentlyDeleted});
    }).catch(err => {
        console.log(err);
})

    //add spent from budget

    // Savings.find().then(savings => {
    //     res.render('savings', {sg: savings});
    // }).catch(err => {
    //     console.log(err);
    // })

    

}

exports.savingsAdd_get = function(req, res, next) {

    const emojis = ["📱", "🕶", "🌴", "🎄", "🚙", "🖥️", ]

    res.render('savings_add', {emojis: emojis});
}

exports.savingsAdd_post = function(req, res, next) {

    let saving = new Savings({
        name: req.body.name.split(' ').join('-').toLowerCase() + "-(Savings)",
        img: req.body.img,
        amount: req.body.amount,
        epm: req.body.epm,
        progress: 0,
        colourInput: req.body.colourInput
    });
    let budget = new Budget({
        category: req.body.name.split(' ').join('-').toLowerCase() + "-(Savings)",
        expected: req.body.epm,
        colourInput: req.body.colourInput,
        spent: 0,
        remaining: req.body.epm,
        income: false,
        
    });

    const savingPromise = saving.save(saving);
  const budgetPromise = budget.save(budget)

  Promise.all([savingPromise, budgetPromise]).then(([s, t]) => {
       res.redirect("/savings");
  }).catch(err => {
      console.log(err);
  })
}

exports.savingsDelete_post = function(req, res, next) {
    console.log(req.params.id)
    console.log(req.body)

    req.app.locals.recentlyDeleted = "true";
    console.log(req.app.locals.recentlyDeleted)

    let returnTrans = new Transaction({
        mainCategory: "return",
        subCategory: "deleted " + req.body.name,
        price: req.body.returned,
        date: new Date(),

    })

    //delete from saving db, from budget db, and all transactions with the same name from db
    const savingPromise = Savings.findByIdAndDelete(req.params.id)
    const budgetPromise = Budget.deleteOne({category: req.body.name})
    const transactionPromise = Transaction.deleteMany({mainCategory: req.body.name})
    const returnPromiseTrans = returnTrans.save()

    Promise.all([savingPromise, budgetPromise, transactionPromise, returnPromiseTrans]).then(([s, b, t, rt]) => {
        console.log("savings successfully deleted!")
        //redirect to /savigns with context informing that saving has been deleted

        //send statuscode

        deleted = true;

        res.redirect("/savings")
   }).catch(err => {
       console.log(err);
   })
}
