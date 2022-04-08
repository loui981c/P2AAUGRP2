var express = require('express');
var router = express.Router();
var monthlyController = require('../controllers/monthlyController');

/* GET monthly overview page. */
router.get('/', monthlyController.monthlyOverview_get);

module.exports = router;
