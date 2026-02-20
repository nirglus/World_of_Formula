const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    id: {type: String, required: false},
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    orderID: { type: mongoose.Schema.Types.ObjectId, ref: 'Order'},
    amount: { type: Number, required: true },
    currency: {type: String, required: true},
    transactionID: {type: String, required: true},
    status: {type: String, default: "Pending"},
    date: { type: Date, default: Date.now }
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = { Payment };