const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        productID: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, default: "" },
        image: { type: String, default: "" },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
        lineTotal: { type: Number, required: true }
    },
    { _id: false }
);

const shopCartSchema = new mongoose.Schema(
    {
        id: { type: String, required: false },
        userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true, sparse: true },
        items: [cartItemSchema],
        totalPrice: { type: Number, required: true, default: 0 }
    },
    { timestamps: true }
);

const ShopCart = mongoose.model("ShopCart", shopCartSchema);

module.exports = { ShopCart };
