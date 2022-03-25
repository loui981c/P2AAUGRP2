var express = require('express');
var router = express.Router();

/* GET monthly overview page. */
router.get('/', function(req, res, next) {
  res.render("monthly");
});

module.exports = router;
