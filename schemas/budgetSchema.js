const { default: mongoose } = require("mongoose");

let budgetSchema = mongoose.Schema ({
    category: String, // dependency on transactions category?
    expected: Number,
    spent: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Budgets', budgetSchema);