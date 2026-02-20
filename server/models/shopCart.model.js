const mongoose = require("mongoose");

const shopCartSchema = new mongoose.Schema({
    id: {type: String, required: false},
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true ,required: true, sparse: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    totalPrice: {type: Number, required: true ,default: 0},

},{ timestamps: true });

const ShopCart = mongoose.model("ShopCart", shopCartSchema);

module.exports = { ShopCart };