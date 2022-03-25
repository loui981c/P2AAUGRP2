var express = require('express');
var router = express.Router();

/* GET transaction page. */
router.get('/', function(req, res, next) {
  res.render("transactions");
});

module.exports = router;