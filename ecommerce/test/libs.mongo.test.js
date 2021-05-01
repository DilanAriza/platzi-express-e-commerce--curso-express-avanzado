const assert = require('assert');
const { expect } = require('chai');
const MongoLib = require('../lib/mongo');
const productsMock = require('../utils/mocks/products.mocks');

const generalObjectToTestingItems = {
    "name": "item 1",
    "description": "this is a first item to testing table",
    "tags": ["nice", "tag1"]
}

let itemIdTestingReturnFromDB;

describe('libs - mongo', () => {
    describe('when MongoLib method is called', function() {
        it('should dbname is not empty', () => {
            const mongoDB = new MongoLib();
            const result = (mongoDB.dbName.length !== 0);
            const expected = true;
            assert.deepStrictEqual(result, expected);
        });

        it('should dbName is equal to platziecommerce', function() {
            const mongoDB = new MongoLib();
            const result = (mongoDB.dbName.toString() === 'platziecommerce');
            const expected = true;
            assert.deepStrictEqual(result, expected);
        });

        it('should return correct connection and get all docs', async() => {
            const mongoDB = new MongoLib();
            const productsTestingConnection = await mongoDB.getAll('products', { tags: { $in: [] } });

            const result = (mongoDB.client.s.options.authSource === 'admin');
            const expected = true;

            expect(productsTestingConnection).to.be.an('array');
            expect(result).to.equal(expected);
        }).timeout(30000);

    });

    describe('When create() method is called', () => {
        it('should return to method `create()` with productId', async() => {
            const mongoDB = new MongoLib();
            let itemIdTesting = await mongoDB.create('testing', generalObjectToTestingItems);
            itemIdTesting = itemIdTesting.toString();
            itemIdTestingReturnFromDB = itemIdTesting;
            expect(itemIdTesting).to.be.an('string');
        }).timeout(20000);
    });

    describe('When get() method is called', () => {
        it('should return to method `get() with object` ', async() => {
            const mongoDB = new MongoLib();
            const productTestingConnection = await mongoDB.get('testing', itemIdTestingReturnFromDB);
            expect(productTestingConnection).to.be.an('object');
        }).timeout(20000);

        it('should return to method `get() with productId` ', async() => {
            const mongoDB = new MongoLib();
            const productTestingConnection = await mongoDB.get('testing', itemIdTestingReturnFromDB);

            const result = (productTestingConnection.lengt !== 0);
            const expected = true;

            expect(result).to.equal(expected);
        }).timeout(20000);
    });


    describe('When update() method is called', () => {
        it('should return to method `update()` with productId', async() => {
            const mongoDB = new MongoLib();
            let itemIdTesting = await mongoDB.update('testing', itemIdTestingReturnFromDB, generalObjectToTestingItems);
            itemIdTesting = itemIdTesting.toString();
            expect(itemIdTesting).to.be.an('string');
        }).timeout(20000);
    });

    describe('When delete() method is called', () => {
        it('should return to method `delete()` with productId', async() => {
            const mongoDB = new MongoLib();
            let itemIdTesting = await mongoDB.delete('testing', itemIdTestingReturnFromDB);
            itemIdTesting = itemIdTesting.toString();
            expect(itemIdTesting).to.be.an('string');
        }).timeout(10000);
    });
});