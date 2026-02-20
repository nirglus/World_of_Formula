const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    id: {type: String, required: false},
    cartID: {type: mongoose.Types.ObjectId, ref: "ShopCart"},
    productID: {type: mongoose.Types.ObjectId, ref: "Product"},
    quantity: {type: Number, required: true},
    price: {type: Number, required: true}
});

const Item = mongoose.model("Item", itemSchema);

module.exports = { Item };