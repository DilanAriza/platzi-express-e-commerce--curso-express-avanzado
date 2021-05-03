const assert = require('assert');
const proxyQuire = require('proxyquire');
const {
    MongoLibMock,
    getAllStub,
    createStub,
    productStub,
    updateStub,
    deleteStub
} = require('../../utils/mocks/mongoLib.mocks');

const {
    productsMock,
    filteredProductsMock,
    ProductsServiceMock
} = require('../../utils/mocks/products.mocks');


// el ".only" nunca debe ir al repo, ya que esto no permite la utilización de los demas test
describe('services - products', () => {
    const ProductsService = proxyQuire('../../services/products.services', {
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
            assert.deepStrictEqual(result, expected);
        });
    });

    describe('When getProduct method is called with productId', async() => {

        const productIdTest = '6bedb1267d1ca7f3053e2875';
        const productsServiceMock = new ProductsServiceMock();

        it('should the get MongoLib method', async() => {
            await productsService.getProduct({ productIdTest });
            assert.strictEqual(productStub.called, true);
        });

        it('should return an object of product', async() => {
            const result = await productsService.getProduct({ productIdTest });
            const expected = await productsServiceMock.getProduct();
            assert.deepStrictEqual(result, expected);
        })
    });

    describe('When createProduct method is called with data product', () => {

        const productsServiceMock = new ProductsServiceMock();
        const product = productsMock[0];

        it('should the create MongoLib method', async() => {
            await productsService.createProduct({ product });
            assert.strictEqual(createStub.called, true);
        });

        it('should return an productId', async() => {
            const result = await productsService.createProduct({ product });
            const expected = await productsServiceMock.createProduct();
            assert.deepStrictEqual(result, expected);
        });
    });

    describe('When updateProduct method is called with data and id product', () => {

        const productsServiceMock = new ProductsServiceMock();
        const productIdTest = '6086d7fa40ef33219a01435b';
        const product = productsMock[0];

        it('should the update MongoLib method', async() => {
            await productsService.updateProduct({ productIdTest, product });
            assert.strictEqual(updateStub.called, true);
        });

        it('should return an productUpdateId', async() => {
            const result = await productsService.updateProduct({ productIdTest, product });
            const expected = await productsServiceMock.updateProduct();
            assert.deepStrictEqual(result, expected);
        })

    });

    describe('When deleteProduct method is called with productId', () => {

        const productsServiceMock = new ProductsServiceMock();
        const productIdTest = '6086d7de40ef33219a01435a';

        it('should the delete MongoLib method', async() => {
            await productsService.deleteProduct({ productIdTest });
            assert.strictEqual(deleteStub.called, true);
        });

        it('should return an productDeleteId', async() => {
            const result = await productsService.deleteProduct({ productIdTest });
            const expected = await productsServiceMock.deleteProduct();
            assert.deepStrictEqual(result, expected);
        });
    });

});