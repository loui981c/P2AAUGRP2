let Transaction = require('../schemas/transactionSchema');
let Budget = require('../schemas/budgetSchema');

exports.savingsOverview_get = function(req, res, next) {
    res.render('savings');
}