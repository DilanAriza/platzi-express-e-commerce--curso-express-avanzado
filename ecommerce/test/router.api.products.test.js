const assert = require('assert');
const proxyquire = require('proxyquire');

const {
    productsMock,
    ProductsServiceMock
} = require('../utils/mocks/products.mocks');

const testServer = require('../utils/testFunctions/testServer');

describe('routes - api - products', () => {
    const route = proxyquire('../routes/api/products.routes', {
        "../../services/products.services": ProductsServiceMock
    });

    const request = testServer(route);

    describe('GET /products', () => {
        it('should respond with status 200', (done) => {
            request.get('/api/products').expect(200, done);
        });

        it('should respond with content type json', (done) => {
            request.get('/api/products').expect("Content-Type", /json/, done);
        })

        it('should respond with not error', (done) => {
            request.get('/api/products').end((err, res) => {
                assert.deepStrictEqual(res.body, {
                    data: productsMock,
                    message: 'products listed'
                });

                done();
            })
        })
    })

})