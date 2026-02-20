const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    id: {type: String, required: false},
    title: {type: String, required: true},
    image: {type: String, required: true},
    images: [{
        url: {type: String, required: false},
        title: {type: String, required: false}
    }],
    description: {type: String, required: true},
    scale: {type: String, required: false},
    totalQuantity: {type: Number, required: true},
    active: {type: Boolean, required: false, default: true},
    price: {type: Number, required: true}
})

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };