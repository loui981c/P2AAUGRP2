const { number } = require("mathjs");
const { default: mongoose } = require("mongoose");

let budgetSchema = new mongoose.Schema ({
    category: String, // dependency on transactions category?
    expected: Number,
});

module.exports = mongoose.model('Budgets', budgetSchema);