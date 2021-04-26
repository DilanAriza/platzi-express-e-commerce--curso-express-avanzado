const assert = require('assert');
const isRequestAjaxOrApi = require('../utils/singleUtils/isRequestAjaxOrApi');

describe('utils - isRequestAjaxOrApi', () => {
    describe('when req accepts html and is not and XMHHttpRequest', () => {
        it('should return false', () => {
            const req = {
                accepts: () => true,
                xhr: false
            };

            const result = isRequestAjaxOrApi(req);
            const expected = false;

            assert.strictEqual(result, expected);
        });
    });

    describe('when req doesn´t accept html and is not an XMHHttpRequest', () => {
        it('should return true', () => {
            const req = {
                accepts: () => false,
                xhr: false
            };

            const result = isRequestAjaxOrApi(req);
            const expected = true;

            assert.strictEqual(result, expected);
        });
    });

    describe('when req accepts html and is an XMHHttpRequest', () => {
        it('should return true', () => {
            const req = {
                accepts: () => false,
                xhr: false
            };

            const result = isRequestAjaxOrApi(req);
            const expected = true;

            assert.strictEqual(result, expected);
        });
    });
});