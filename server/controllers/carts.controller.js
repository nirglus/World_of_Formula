const { ShopCart } = require("../models/shopCart.model");
const { Item } = require("../models/item.model");

const createNewCart = async (req, res) => {
    try {
        const userID = req.user.id;
        const newCart = new ShopCart({ userID });
        newCart.id = newCart._id;
        await newCart.save();
        res.send({ message: "User saved succesfully!", user: req.user, token: req.token, cart: newCart });

    } catch (error) {
        console.log(error);
        res.status(400).send("Error");
    }
};

const getUserCart = async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await ShopCart.findById(id);
        if (cart) return res.send(cart);
        res.send("Couldn't find cart");
    } catch (error) {
        res.status(400).send(Error);
    }
}

const getUserCartByUserID = async (req, res) => {
    const { id } = req.params;
    try {
        const existingCart = await ShopCart.findOne({ userID: id }).populate({
            path: 'items',
            populate: { path: 'productID' }
        });

        if (existingCart) {
            let totalPrice = 0;
            existingCart.items.forEach(item => {
                totalPrice += item.price;
            });
            existingCart.totalPrice = totalPrice;
            await existingCart.save();

            return res.send(existingCart);
        } else {
            return res.send("Couldn't find cart for the user");
        }
    } catch (error) {
        console.log(error);
        res.status(400).send("Error");
    }
};

const addItemToCart = async (req, res) => {
    const cartID = req.params.id;
    try {
        const { productID, quantity, price } = req.body;
        console.log({cartID});
        let existingItem = await Item.findOne({ cartID, productID });
        if (!existingItem) {
            existingItem = new Item({ cartID, productID, quantity, price: price * quantity });
            await existingItem.save();
            const cart = await ShopCart.findByIdAndUpdate(cartID, { $push: { items: existingItem } }, { new: true }).populate({
                path: 'items',
                populate: { path: 'productID' }
            });
            if (cart) return res.send(cart);
        } else {
            existingItem.quantity = quantity;
            existingItem.price = price * existingItem.quantity;
            await existingItem.save();
            return res.send("Item has been updated");
        }
        return res.send("Cart is not found");
    } catch (error) {
        console.log(error);
        res.status(400).send("Error");
    }
};

const deleteItemFromCart = async (req, res) => {
    const { id, itemID } = req.params;
    try {
        const cart = await ShopCart.findByIdAndUpdate(id, { $pull: { items: itemID } }, { new: true }).populate({
            path: 'items',
            populate: { path: 'productID' }
        });

        if (!cart) {
            return res.status(404).send("Cart not found");
        }
        // Recalculate the total price
        let totalPrice = 0;
        for (const item of cart.items) {
            totalPrice += item.price;
        }

        cart.totalPrice = totalPrice;
        await cart.save();
        await Item.findByIdAndDelete(itemID);
        res.send({ message: "Item was removed", data: cart });
    } catch (error) {
        console.error("Error removing item", error);
        res.status(400).send("Error");
    }
};
const deleteCart = async (req, res) => {
    const { id } = req.params;
    try {
        await Item.findByIdAndDelete(id);
        res.send("Shopping cart was deleted!");
    } catch (error) {
        console.log(error);
        res.status(400).send("Error");
    }
};


module.exports = { createNewCart, addItemToCart, deleteItemFromCart, deleteCart, getUserCart, getUserCartByUserID };
