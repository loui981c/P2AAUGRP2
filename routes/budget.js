var express = require('express');
var router = express.Router();

/* GET budget page. */
router.get('/', function(req, res, next) {
    res.render("budget")
});

router.get('/add', function(req, res, next) {
    res.render("add_budget")
});

module.exports = router;