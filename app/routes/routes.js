module.exports = app => {
    const product = require("../controllers/product.controller.js");
    const cart = require("../controllers/cart.controller.js");
    var router = require("express").Router();

    var multer = require('multer');
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/uploads/');
        },
        filename: (req, file, cb) => {
            var filetype = '';
            if (file.mimetype === 'image/gif') {
                filetype = 'gif';
            }
            if (file.mimetype === 'image/png') {
                filetype = 'png';
            }
            if (file.mimetype === 'image/jpeg') {
                filetype = 'jpg';
            }
            cb(null, 'image-' + Date.now() + '.' + filetype);
        }
    });
    var upload = multer({ storage: storage });

    router.post('/products', upload.single('image'), product.add)
    router.get('/products', product.getAll)

    router.post('/cart', cart.add)
    router.put('/cart', cart.update)
    router.get('/cart', cart.getAll)

    app.use('/', router)
}