const { default: mongoose } = require("mongoose");

var transactionSchema = new mongoose.Schema({
    main: String,
    sub: String,
    price: Number,
    date: {type: Date, default: Date.now()}
   });

module.exports = mongoose.model("Transactions", transactionSchema);