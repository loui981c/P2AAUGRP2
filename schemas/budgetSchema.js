const { default: mongoose } = require("mongoose");

let budgetSchema = new mongoose.Schema ({
    category: String, // dependency on transactions category?
    expected: Number,
    colourInput: String,
});

module.exports = mongoose.model('Budgets', budgetSchema);