const express = require("express");
const usersRouter = require("./routes/users.routes");
const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/carts.routes");
const ordersRouter = require("./routes/orders.routes");
const pingRoute = require('./routes/ping.routes');

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/wof/users", usersRouter);
app.use("/wof/products",productsRouter);
app.use("/wof/cart", cartsRouter);
app.use("/wof/orders", ordersRouter);
app.use('/wof/ping', pingRoute);

module.exports = { app }