const db = require("../models");
const product = db.product;

module.exports.add = (req, res) => {
    if(req.body.name && req.file && req.body.description && req.body.qty && req.body.price) {

        let newProduct = new product({
            name: req.body.name,
            image: req.file.filename,
            description: req.body.description,
            qty: req.body.qty,
            price: req.body.price
        })

        newProduct.save((err, data) => {
            if(err) {
                res.status(400).send({success: false, result: {message: err.message}})
            } else {
                res.status(200).send({success: true, result: {message: 'Product added successfully'}})
            }
        })

    } else {
        if(!req.body.name) {
            res.status(404).send({success: false, result: {message: 'Product name is required.'}})
        } else if (!req.file) {
            res.status(404).send({success: false, result: {message: 'Product image is required.'}})
        } else if (!req.body.description) {
            res.status(404).send({success: false, result: {message: 'Product description is required.'}})
        } else if (!req.body.qty) {
            res.status(404).send({success: false, result: {message: 'Product quantity is required.'}})
        } else {
            res.status(404).send({success: false, result: {message: 'Product unit price is required.'}})
        }
    }
}

module.exports.getAll = (req, res) => {
    product.find({}, (err, data) => {
        if(err) {
            res.status(400).send({success:false, result: {message: err.message}})
        } else {
            if(data.length > 0) {
                res.status(200).send({success:true, result: {message: 'Product List', data: data}})
            } else {
                res.status(404).send({success:false, result: {message: 'Products not found'}})
            }
        }
    })
}