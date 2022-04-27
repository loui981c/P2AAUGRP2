var express = require('express');
var router = express.Router();
var savingsController = require('../controllers/savingsController')

router.get('/', savingsController.savingsOverview_get);

router.get('/add', savingsController.savingsAdd_get);

router.post('/add', savingsController.savingsAdd_post);

module.exports = router;


