const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: addressSchema, required: true },
    status: { type: String, default: "Pending" },
    items: [{ 
        productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
},{ timestamps: true });

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };