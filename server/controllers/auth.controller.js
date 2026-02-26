const { User } = require("../models/user.model");
const { ShopCart } = require("../models/shopCart.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");

const DEMO_EMAIL = "demo@worldofformula.app";
const DEMO_NAME = "Demo User";

function sanitizeUser(user) {
    if (!user) return null;
    const obj = user.toObject ? user.toObject() : { ...user };
    delete obj.password;
    if (obj._id && !obj.id) obj.id = obj._id;
    return obj;
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

const demoLogin = async (req, res) => {
    try {
        let user = await User.findOne({ email: DEMO_EMAIL });
        if (!user) {
            const hash = await bcrypt.hash(Math.random().toString(36) + Date.now(), 10);
            user = new User({
                email: DEMO_EMAIL,
                fullName: DEMO_NAME,
                password: hash,
                role: "demo"
            });
            user.id = user._id;
            await user.save();
        }

        let cart = await ShopCart.findOne({ userID: user._id }).lean();
        if (!cart) {
            const newCart = new ShopCart({ userID: user._id, items: [], totalPrice: 0 });
            newCart.id = newCart._id;
            await newCart.save();
            cart = newCart.toObject();
        } else {
            await ShopCart.findByIdAndUpdate(cart._id, { $set: { items: [], totalPrice: 0 } });
            cart = await ShopCart.findById(cart._id).lean();
        }

        const token = generateToken({ id: user._id, email: user.email, role: user.role });
        const sanitized = sanitizeUser(user);
        const cartPayload = normalizeCartResponse(cart);

        return res.send({
            message: "Demo login successful",
            user: sanitized,
            token,
            cart: cartPayload
        });
    } catch (error) {
        console.error("Demo login error:", error);
        res.status(400).send("Error");
    }
};

module.exports = { demoLogin };
