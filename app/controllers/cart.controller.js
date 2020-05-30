const db = require("../models");
const cart = db.cart;
const product = db.product;

module.exports.add = (req, res) => {
    if (req.body.productId != null && req.body.qty != null) {
        product.findOne({ _id: req.body.productId, qty: { '$gte': req.body.qty } }, (err, data) => {
            if (err) {
                res.status(400).send({ success: false, result: { message: err.message } })
            } else {
                if (data) {
                    let productObj = {
                        name: data.name,
                        image: data.image,
                        description: data.description,
                        price: data.price,
                        qty: req.body.qty
                    }

                    let newCart = new cart({
                        product: productObj,
                        cartTotal: parseInt(data.price) * parseInt(req.body.qty)
                    })

                    newCart.save((err, data) => {
                        if (err) {
                            res.status(400).send({ success: false, result: { message: err.message } })
                        } else {
                            res.status(200).send({ success: true, result: { message: 'Product added to cart successfully' } })
                        }
                    })
                } else {
                    res.status(400).send({ success: false, result: { message: 'Inventory does not have this product or enough quantity of product' } })
                }
            }
        })
    } else {
        if (!req.body.productId) {
            res.status(404).send({ success: false, result: { message: 'Product required for add to cart' } })
        } else {
            res.status(404).send({ success: false, result: { message: 'Product qty required for add to cart' } })
        }
    }
}

module.exports.getAll = (req, res) => {
    cart.find({}, (err, data) => {
        if (err) {
            res.status(400).send({ success: false, result: { message: err.message } })
        } else {
            if (data.length > 0) {
                res.status(200).send({ success: true, result: { message: 'Cart List', data: data } })
            } else {
                res.status(404).send({ success: false, result: { message: 'Cart not found' } })
            }
        }
    })
}

module.exports.update = (req, res) => {
    if (req.body.cartId && req.body.qty) {
        cart.update({ _id: req.body.cartId }, { qty: req.body.qty }, (err, data) => {
            if (err) {
                res.status(400).send({ success: false, result: { message: err.message } })
            } else {
                res.status(200).send({ success: true, result: { message: 'Qty updated' } })
            }
        })
    } else {
        if (!req.body.cartId) {
            res.status(404).send({ success: false, result: { message: 'Cart required' } })
        } else {
            res.status(404).send({ success: false, result: { message: 'Product qty required for updat cart' } })
        }
    }
}