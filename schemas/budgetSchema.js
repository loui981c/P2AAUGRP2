const { default: mongoose } = require("mongoose");

let budgetSchema = mongoose.Schema ({
    category: {type: String, required: true}, // dependency on transactions category?
    expected: {type: Number, required: true},
    spent: {type: mongoose.Schema.Types.ObjectId, ref: 'Transactions'},
    remaining: 0,
});

module.exports = mongoose.model('Budget', budgetSchema);