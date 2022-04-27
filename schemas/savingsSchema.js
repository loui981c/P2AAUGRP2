const { default: mongoose } = require("mongoose");

var savingsSchema = new mongoose.Schema({
    name: String, 
    amount: Number,
    epm: Number,
    img: String,
    progress: Number,
   });

module.exports = mongoose.model("Savings", savingsSchema);
