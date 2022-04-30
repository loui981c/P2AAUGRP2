const { default: mongoose } = require("mongoose");

let budgetSchema = new mongoose.Schema ({
    income: { type: Boolean, default: false},
    category: String,
    expected: Number,
    colourInput: String,
    spent: Number,
    remaining: Number,
    income: Boolean,
});

module.exports = mongoose.model('Budgets', budgetSchema);
