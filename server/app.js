const express = require("express");
const usersRouter = require("./routes/users.routes");
const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/carts.routes");
const ordersRouter = require("./routes/orders.routes");
const pingRoute = require('./routes/ping.routes');

const cors = require("cors");

const app = express();
// Log cart/order requests so we can confirm the server is hit (remove when done debugging)
app.use((req, res, next) => {
    const url = req.originalUrl || req.url || req.path || "";
    if (url.includes("/wof/cart") || url.includes("/wof/orders")) {
        console.log("[CART_DEBUG] INCOMING", req.method, url);
    }
    next();
});

app.use(express.json());
app.use(cors());

app.use("/wof/users", usersRouter);
app.use("/wof/products",productsRouter);
app.use("/wof/cart", cartsRouter);
app.use("/wof/orders", ordersRouter);
app.use('/wof/ping', pingRoute);

module.exports = { app }