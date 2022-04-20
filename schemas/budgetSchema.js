const { default: mongoose } = require("mongoose");

let budgetSchema = new mongoose.Schema ({
    category: String, // dependency on transactions category?
    expected: Number,
    colourInput: String,
    spent: Number,
    remaining: Number,
});

module.exports = mongoose.model('Budgets', budgetSchema);
