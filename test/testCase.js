process.env.NODE_ENV = 'test';
const assert = require('assert');

let fs = require('fs')

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
let should = chai.should();
chai.use(chaiHttp);

let server = require('../index');

let lastAddedProductId = null
describe('Product', () => {
    it('it should add new product', (done) => {
        var filename = 'image-1590512934652.jpg'
        chai.request(server)
            .post('/products')
            .set('authorization', 'REVELIO')
            .set('content-type', 'multipart/form-data')
            .field('name', 'abc')
            .field('description', 'Lorem Ipsum dolar sit amet')
            .field('qty', 500)
            .field('price', 20)
            .attach('image', fs.readFileSync('./test/' + filename))
            .attach('image', 'test/' + filename)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                expect(res.body.success, true)
                done();
            });
    });
    it('it should GET all the products', (done) => {
        chai.request(server)
            .get('/products')
            .set('authorization', 'REVELIO')
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.success, true)
                res.body.should.be.a('object');
                res.body.success.should.be.a('boolean')
                let productsCount = res.body.result.data.length
                lastAddedProductId = res.body.result.data[productsCount - 1]._id
                done();
            });
    });
    
});

describe('Cart', () => {
    it('it should GET the cart', (done) => {
        chai.request(server)
            .get('/cart')
            .set('authorization', 'REVELIO')
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.success, true)
                res.body.should.be.a('object');
                res.body.success.should.be.a('boolean')
                done();
            });
    });
    it('it should give error as productId is empty', (done) => {
        chai.request(server)
            .post('/cart')
            .set('authorization', 'REVELIO')
            .set('content-type', 'application/json')
            .field({'productId':'', qty: 10})
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.success.should.be.a('boolean')
                expect(res.body.success, false)
                done();
            });
    });
    it('it should give error as product qty is higher than in inventory', (done) => {
        chai.request(server)
            .post('/cart')
            .set('authorization', 'REVELIO')
            .set('content-type', 'application/json')
            .field({'productId':'5ece9888c24a49264437be00', qty: 501})
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.success.should.be.a('boolean')
                expect(res.body.success, false)
                done();
            });
    });
    it('it should add product to cart', (done) => {
        chai.request(server)
            .post('/cart')
            .set('authorization', 'REVELIO')
            .set('content-type', 'application/json')
            .send({'productId':lastAddedProductId, qty: 10})
            .end((err, res) => {
                console.log(res.body.result.message)
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.be.a('boolean')
                expect(res.body.success, false)
                done();
            });
    });
    it('it should update product qty in cart', (done) => {
        chai.request(server)
            .put('/cart')
            .set('authorization', 'REVELIO')
            .set('content-type', 'application/json')
            .field({'cartId':'5ecd58cb33b1bd46d8429511', qty: 15})
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.success.should.be.a('boolean')
                expect(res.body.success, false)
                done();
            });
    });
})