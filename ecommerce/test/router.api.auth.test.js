const express = require('express');
const supertest = require('supertest')
const { expect } = require('chai');
const httpStatus = require('http-status');
const proxyquire = require('proxyquire');
const { config } = require('../config');

const {
    productsMock,
    ProductsServiceMock,
    filteredProductsMock
} = require('../utils/mocks/products.mocks');

function testServer(route) {
    const app = express();
    route(app);
    return supertest(app);
}

const { authAdminUsername, authAdminPassword } = config;

// const testServer = require('../utils/testFunctions/testServer');

describe('routes - api - auth', () => {

    const route = proxyquire('../routes/api/auth.routes', {
        "../../services/products.services": ProductsServiceMock
    });

    const request = testServer(route);

    describe('POST /auth/token', () => {
        it('sohuld return all products with status 200', () => {
            return request.post('/api/auth/token')
                .auth(authAdminUsername, authAdminPassword)
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.status).to.be.equal(200);
                });
        }).timeout(30000);
    });
});