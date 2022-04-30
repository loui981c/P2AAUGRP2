var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

// handle post request from welcome page
router.post("/", (req, res)=>{

  //this is if the user is trying to sign in
  if (req.body.login == "bob")
  {
    res.redirect("/budget")
  //this is if the user is trying to create sign up
  }
  //this is if the user is trying to sign in, but its wrong
  else if (req.body.newuser){
    res.send(`new user created page for this person: ${req.body.newuser}`)

  }
  else{
    res.render("index")
  }
})

module.exports = router;
