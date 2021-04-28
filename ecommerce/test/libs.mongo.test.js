const assert = require('assert');
const MongoLib = require('../lib/mongo');
const productsMock = require('../utils/mocks/products.mocks');

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
    });
});