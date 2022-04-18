var express = require('express');
var router = express.Router();
var savingsController = require('../controllers/savingsController')

router.get('/', savingsController.savingsOverview_get);

module.exports = router;
