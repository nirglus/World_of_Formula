const { Order } = require("../models/order.model");

const createOrder = async(req, res) =>{
    try {
        const {userID, address, cartID, items, totalPrice} = req.body;
        const newOrder = new Order({userID, address, cartID, items, totalPrice});
        newOrder.id = newOrder._id;
        await newOrder.save();
        res.send({message: "Order has been created"});  
    } catch (error) {
        console.log(error);
        res.status(400).send("Error");
    }
}

const getOrder = async(req,res) =>{
    const {id} = req.params;
    try {
        const order = await Order.findById(id);
        if(order) return res.send(order);
        res.send("Couldn't find order");
    } catch (error) {
        res.status(400).send(Error);
    }
}

const getUserOrders = async(req,res) =>{
    const id = req.body.id
    try {
        const orders = await Order.find(id).populate({
            path: 'items',
            populate: { path: 'productID' }
        });;
        if(orders) return res.send(orders);
        res.send("Couldn't find orders");
    } catch (error) {
        res.status(400).send(Error);
    }
}

const updateOrderStatus = async(req,res)=>{
    const body = req.body;
    const { id } = req.params;
    try {
        const order = await Order.findByIdAndUpdate(id, body, {new: true});
        if(order) return res.send(order);
        return res.send("Order is not found");
    } catch (error) {
        res.status(400).send("Error");
    }
};

const deleteOrder = async (req, res)=>{
    const { id } = req.params;
    try {
        await Order.findByIdAndDelete(id);
        return res.send("Succesfully deleted order");
    } catch (error) {
        console.log(error);
        res.status(400).send("Error");
    }
};


module.exports = {createOrder, updateOrderStatus, getOrder, getUserOrders, deleteOrder};