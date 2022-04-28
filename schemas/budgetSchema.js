const { default: mongoose } = require("mongoose");

let budgetSchema = new mongoose.Schema ({
    //ExOrIn: { type: Boolean, default: false},
    category: String,
    expected: Number,
    colourInput: String,
    spent: Number,
    remaining: Number,
});

module.exports = mongoose.model('Budgets', budgetSchema);
