let Transaction = require('../schemas/transactionSchema');
let Budget = require('../schemas/budgetSchema');
let Savings = require('../schemas/savingsSchema');

exports.savingsOverview_get = function(req, res, next) {

    const savingPromise = Savings.find()
    const budgetPromise = Transaction.find()
  
    Promise.all([savingPromise, budgetPromise]).then(([saving, trans]) => {

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
                progress: totalSpent,})
       }
         res.render("savings", {sg: dataForPage})
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

    let saving = new Savings(req.body);
    let budget = new Budget({
        category: req.body.name,
        expected: req.body.epm,
        colourInput: "#FFFFFF",
        spent: 0,
        remaining: req.body.epm
    });

    const savingPromise = saving.save(saving);
  const budgetPromise = budget.save(budget)

  Promise.all([savingPromise, budgetPromise]).then(([s, t]) => {
       res.redirect("/savings");
  }).catch(err => {
      console.log(err);
  })
}
