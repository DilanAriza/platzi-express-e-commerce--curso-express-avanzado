const { productsMock, filteredProductsMock } = require('./products.mocks');

const sinon = require('sinon');

const getAllStub = sinon.stub();
const tagQuery = { tags: { $in: ['expensive'] } };

getAllStub.withArgs('products').resolves(productsMock);
getAllStub
    .withArgs('products').resolves(productsMock)
    .withArgs('products').resolves(filteredProductsMock('expensive'));

const productStub = sinon.stub().resolves(productsMock[0]);

const createStub = sinon.stub().resolves('6bedb1267d1ca7f3053e2875');
const updateStub = sinon.stub().resolves('6086d7fa40ef33219a01435b');
const deleteStub = sinon.stub().resolves('6086d7de40ef33219a01435a');

class MongoLibMock {
    getAll(collection, query) {
        return getAllStub(collection, query);
    }

    get(collection, id) {
        return productStub(collection, id);
    }

    create(collection, data) {
        return createStub(collection, data)
    }

    update(collection, data, id) {
        return updateStub(collection, data, id);
    }

    delete(collection, id) {
        return deleteStub(collection, id);
    }
}

module.exports = {
    getAllStub,
    createStub,
    productStub,
    updateStub,
    deleteStub,
    MongoLibMock
}