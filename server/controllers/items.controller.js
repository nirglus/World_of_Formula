const { Item } = require("../models/item.model");


const getItems = async(req, res) =>{
    try {
        const query = req.query;
        const items =  await Item.find({ ...query });
        res.send(items);
    } catch (error) {
        res.status(400).send("Error");
    }
}

const updateItem = async(req, res) =>{
    const body = req.body;
    const { id } = req.params;
    try {
        const item = await Item.findByIdAndUpdate(id, body, {new: true});
        if(item) return res.send(item)
        return res.send("Item is not found");
    } catch (error) {
        res.status(400).send("Error");
    }
}

const deleteItem = async(req, res) =>{
    const { id } = req.params;
    try {
        await Item.findByIdAndDelete(id);
        res.send("Succesfully deleted item");
    } catch (error) {
        console.log(error);
        res.status(400).send("Error");
    }
};

module.exports = { addItem, deleteItem, getItems, updateItem};