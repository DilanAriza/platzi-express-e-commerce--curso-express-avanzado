const assert = require('assert');
const proxyQuire = require('proxyquire');
const {
    MongoLibMock,
    getAllStub,
    createStub
} = require('../utils/mocks/mongoLib.mocks');

const {
    productsMock,
    filteredProductsMock,
    ProductsServiceMock
} = require('../utils/mocks/products.mocks');


// el ".only" nunca debe ir al repo, ya que esto no permite la utilización de los demas test
describe('services - products', () => {
    const ProductsService = proxyQuire('../services/products.services', {
        '../lib/mongo': MongoLibMock
    });

    const productsService = new ProductsService();

    describe('when getProducts method is called', async() => {
        it('should call the getAll MongoLib method', async() => {
            await productsService.getProducts({});
            assert.strictEqual(getAllStub.called, true);
        });

        it('should return an array that is not empty', async() => {
            const products = await productsService.getProducts({});
            const result = (Object.entries(products).length !== 0);
            const expected = (Object.entries(productsMock).length !== 0);
            assert.deepStrictEqual(result, expected);
        });
    });

    describe('when getProducts method is called with tags', async() => {
        it('should the getAll MongoLib method with tags args', async() => {
            await productsService.getProducts({ tags: ['expensive'] });
            const tagQuery = { tags: { $in: ['expensive'] } };
            assert.strictEqual(getAllStub.calledWith('products', tagQuery), true);
        });

        it('should return an array of products filtered by the tag', async() => {
            const result = await productsService.getProducts({ tags: ['expensive'] });
            const expected = filteredProductsMock('expensive');
            assert.deepStrictEqual(result, expected)
        });
    });


});