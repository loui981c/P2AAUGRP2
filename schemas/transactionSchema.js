const { default: mongoose } = require("mongoose");

var transactionSchema = new mongoose.Schema({
    mainCategory: String, 
    subCategory: String,
    price: Number,
    date: {type: Date, default: Date.now()}
   });

module.exports = mongoose.model("Transactions", transactionSchema);
