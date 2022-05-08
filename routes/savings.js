var express = require('express');
var router = express.Router();
var savingsController = require('../controllers/savingsController')
let Savings = require('../schemas/savingsSchema');
let Budget = require('../schemas/budgetSchema');
let Transaction = require('../schemas/transactionSchema');

router.get('/', savingsController.savingsOverview_get);

router.get('/add', savingsController.savingsAdd_get);

router.post('/add', savingsController.savingsAdd_post);

router.get("/:id/edit", (req, res) => {

    //fetch saving from db by id
    Savings.findById(req.params.id).then(saving => {
        
        let sugar = {
            name: saving.name.split("(")[0],
            img: saving.img,
            amount: saving.amount,
            epm: saving.epm,
            progress: saving.progress,
            colourInput: saving.colourInput,
            oldname: saving.name,
            _id: saving._id,
        }
        console.log(sugar)
        const emojis = ["📱", "🕶", "🌴", "🎄", "🚙", "🖥️", ]
        
    res.render("savings_edit", {sg: sugar, emojis: emojis})})
});

router.post("/:id/edit", (req, res) => {
    // let saving = new Savings({
    //     name: req.body.name + "(Savings)",
    //     img: req.body.img,
    //     amount: req.body.amount,
    //     epm: req.body.epm,
    //     progress: req.body.progress,
    //     colourInput: req.body.colourInput,
    // })
    req.body.name = req.body.name.split(' ').join('-').toLowerCase() + "-(Savings)" // Replace space + lowercase
    // Savings.findByIdAndUpdate(req.params.id, req.body).then(() => {
    //     res.redirect("/savings")})

    //find budget and saving by id and update both with new values

    const savingPromise = Savings.findByIdAndUpdate(req.params.id, req.body)
    const transactionPromise = Transaction.updateMany({mainCategory: req.body.oldname}, {mainCategory: req.body.name})
    const budgetPromise = Budget.updateOne({category: req.body.oldname}, {$set: {
        category: req.body.name,
        expected: req.body.epm,
    }})
  
    Promise.all([savingPromise, budgetPromise, transactionPromise]).then(([s, b, t]) => {
         res.redirect("/savings");
    }).catch(err => {
        console.log(err);
    })


})

    router.post("/:id/delete", (req, res) => {
        console.log(req.params.id)
        console.log(req.body)

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
            res.redirect("/savings");
       }).catch(err => {
           console.log(err);
       })
    })

module.exports = router;


