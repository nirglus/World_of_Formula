const mongoose = require("mongoose");
const { ShopCart } = require("../models/shopCart.model");
const { Item } = require("../models/item.model");
const { Product } = require("../models/product.model");

function isOldFormat(cart) {
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) return false;
    const first = cart.items[0];
    return (
        first instanceof mongoose.Types.ObjectId ||
        (typeof first === "object" && first !== null && first.constructor && first.constructor.name === "ObjectId") ||
        (typeof first === "object" && first !== null && first.lineTotal === undefined && first.unitPrice === undefined)
    );
}

async function migrateCartToEmbedded(cart) {
    if (!cart || !isOldFormat(cart)) return cart;
    const cartId = cart._id;
    const itemIds = cart.items.filter((i) => mongoose.Types.ObjectId.isValid(i));
    if (itemIds.length === 0) {
        await ShopCart.findByIdAndUpdate(cartId, { $set: { items: [], totalPrice: 0 } });
        return ShopCart.findById(cartId).lean();
    }
    const itemDocs = await Item.find({ _id: { $in: itemIds } }).populate("productID");
    const productMap = new Map();
    itemDocs.forEach((item) => {
        const product = item.productID && typeof item.productID === "object" ? item.productID : null;
        const productID = product ? product._id : item.productID;
        const unitPrice = item.quantity > 0 ? item.price / item.quantity : 0;
        productMap.set(String(item._id), {
            id: item._id.toString(),
            productID,
            name: product ? (product.title || product.name || "") : "",
            image: product ? (product.image || "") : "",
            unitPrice,
            quantity: item.quantity,
            lineTotal: item.price
        });
    });
    const newItems = itemIds
        .map((id) => productMap.get(String(id)))
        .filter(Boolean);
    const totalPrice = newItems.reduce((sum, i) => sum + i.lineTotal, 0);
    await ShopCart.findByIdAndUpdate(cartId, { $set: { items: newItems, totalPrice } });
    await Item.deleteMany({ cartID: cartId });
    return ShopCart.findById(cartId).lean();
}

function normalizeCartResponse(cart) {
    if (!cart) return null;
    const items = Array.isArray(cart.items)
        ? cart.items
            .filter((i) => i && typeof i === "object" && i.lineTotal !== undefined)
            .map((i) => {
                const unitPrice = Number(i.unitPrice) || 0;
                return {
                    id: i.id || (i._id && i._id.toString()),
                    productID: i.productID,
                    name: i.name || "",
                    image: i.image || "",
                    unitPrice,
                    quantity: Number(i.quantity) || 0,
                    lineTotal: Number(i.lineTotal) || 0,
                    price: unitPrice
                };
            })
        : [];
    return {
        id: cart._id || cart.id,
        userID: cart.userID,
        items,
        totalPrice: Number(cart.totalPrice) || 0
    };
}

const createNewCart = async (req, res) => {
    try {
        const userID = req.user.id;
        const existingCart = await ShopCart.findOne({ userID }).lean();
        if (existingCart) {
            const migrated = await migrateCartToEmbedded(existingCart);
            return res.send({
                message: "User saved succesfully!",
                user: req.user,
                token: req.token,
                cart: normalizeCartResponse(migrated) || migrated
            });
        }
        const newCart = new ShopCart({ userID, items: [], totalPrice: 0 });
        newCart.id = newCart._id;
        await newCart.save();
        res.send({
            message: "User saved succesfully!",
            user: req.user,
            token: req.token,
            cart: normalizeCartResponse(newCart.toObject()) || newCart
        });
    } catch (error) {
        console.log(error);
        res.status(400).send("Error");
    }
};

const getUserCart = async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await ShopCart.findById(id).lean();
        if (!cart) return res.send("Couldn't find cart");
        const migrated = await migrateCartToEmbedded(cart);
        return res.send(normalizeCartResponse(migrated) || migrated);
    } catch (error) {
        res.status(400).send("Error");
    }
};

const getUserCartByUserID = async (req, res) => {
    const { id } = req.params;
    try {
        const existingCart = await ShopCart.findOne({ userID: id }).lean();
        if (!existingCart) return res.send("Couldn't find cart for the user");
        const migrated = await migrateCartToEmbedded(existingCart);
        return res.send(normalizeCartResponse(migrated));
    } catch (error) {
        console.log(error);
        res.status(400).send("Error");
    }
};

const addItemToCart = async (req, res) => {
    const cartID = req.params.id;
    try {
        const { productID, quantity, price } = req.body;
        const cartDoc = await ShopCart.findById(cartID).lean();
        if (!cartDoc) return res.status(404).send("Cart not found");

        let cart = await migrateCartToEmbedded(cartDoc);
        if (!cart) cart = cartDoc;
        const items = Array.isArray(cart.items) ? cart.items : [];
        const unitPrice = Number(price) || 0;
        const lineTotal = unitPrice * (Number(quantity) || 0);
        const existingIndex = items.findIndex((i) => String(i.productID) === String(productID));

        if (existingIndex >= 0) {
            items[existingIndex].quantity = quantity;
            items[existingIndex].lineTotal = lineTotal;
        } else {
            const product = await Product.findById(productID).lean();
            const name = product ? (product.title || product.name || "") : "";
            const image = product ? (product.image || "") : "";
            items.push({
                id: new mongoose.Types.ObjectId().toString(),
                productID,
                name,
                image,
                unitPrice,
                quantity: Number(quantity) || 1,
                lineTotal
            });
        }

        const totalPrice = items.reduce((sum, i) => sum + (Number(i.lineTotal) || 0), 0);
        await ShopCart.findByIdAndUpdate(cartID, { $set: { items, totalPrice } });
        const updated = await ShopCart.findById(cartID).lean();
        return res.send(normalizeCartResponse(updated));
    } catch (error) {
        console.log(error);
        res.status(400).send("Error");
    }
};

const deleteItemFromCart = async (req, res) => {
    const { id: cartID, itemID } = req.params;
    try {
        const cartDoc = await ShopCart.findById(cartID).lean();
        if (!cartDoc) return res.status(404).send("Cart not found");

        let cart = await migrateCartToEmbedded(cartDoc);
        if (!cart) cart = cartDoc;
        const items = Array.isArray(cart.items) ? cart.items.filter((i) => i && String(i.id) !== String(itemID)) : [];
        const totalPrice = items.reduce((sum, i) => sum + (Number(i.lineTotal) || 0), 0);
        await ShopCart.findByIdAndUpdate(cartID, { $set: { items, totalPrice } });
        const updated = await ShopCart.findById(cartID).lean();
        return res.send({ message: "Item was removed", data: normalizeCartResponse(updated) });
    } catch (error) {
        console.error("Error removing item", error);
        res.status(400).send("Error");
    }
};

const deleteCart = async (req, res) => {
    const { id } = req.params;
    try {
        await Item.deleteMany({ cartID: id });
        await ShopCart.findByIdAndDelete(id);
        res.send("Shopping cart was deleted!");
    } catch (error) {
        console.log(error);
        res.status(400).send("Error");
    }
};

module.exports = {
    createNewCart,
    addItemToCart,
    deleteItemFromCart,
    deleteCart,
    getUserCart,
    getUserCartByUserID
};
