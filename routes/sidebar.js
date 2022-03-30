var express = require('express');
var router = express.Router();

/* GET sidebar page. this is temporary */
router.get('/', function(req, res, next) {
  res.render("partials/sidebar");
});

module.exports = router;