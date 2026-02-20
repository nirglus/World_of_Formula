const { Product } = require("../models/product.model");

const createProduct = async(req, res) =>{
    try {
        const {title, image, description, scale, totalQuantity, price} = req.body;
        const newProduct = new Product({title, image, description, scale, totalQuantity, price});
        newProduct.id = newProduct._id;
        await newProduct.save();
        res.send({message: "Product saved succesfully!", data: newProduct});
    } catch (error) {
        console.log(error);
        res.status(400).send("Error");
    }
}

const getSingleProduct = async(req, res) =>{
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if(product) return res.send(product);
        res.send("Couldn't find product");
    } catch (error) {
        res.status(400).send(Error);
    }
}

const getProducts = async(req, res) =>{
    try {
        const query = req.query;
        const products =  await Product.find({ ...query });
        res.send(products);
    } catch (error) {
        res.status(400).send("Error");
    }
}

const updateProduct = async(req, res) =>{
    const body = req.body;
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(id, body, {new: true});
        if(product) return res.send(product)
        return res.send("Product is not found");
    } catch (error) {
        res.status(400).send("Error");
    }

}

const disableProduct = async(req, res) =>{
    const id = req.body.id;
    const active = req.body.active;
    try {
        await Product.findByIdAndUpdate(id, {active: active}, {new: true});
        res.send("Succesfully disabled product");
    } catch (error) {
        console.log(error);
        res.status(400).send("Error");
    }
};

module.exports = { createProduct, updateProduct, disableProduct, getSingleProduct, getProducts};