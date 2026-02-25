const { app } = require("./app");
const mongoose = require("mongoose");
const { config } = require("./config");
const keepServerAlive = require('./tasks/pingTask');


mongoose.connect(config.MONGO_URL)
   .then(() =>{
    console.log("Connected to db");
   }).catch(error =>{
    console.log(error);
   });

const PORT = process.env.PORT || 2000;
    console.log("[CART_DEBUG] To see cart/order logs here, point frontend to this server (e.g. in .env: VITE_API_URL=http://localhost:" + PORT + "/wof)");

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    keepServerAlive();
});