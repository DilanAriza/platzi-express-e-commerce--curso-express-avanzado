const assert = require('assert');
const { expect } = require('chai');
const httpStatus = require('http-status');
const proxyquire = require('proxyquire');
const { config } = require('../../config');

const {
    productsMock,
    ProductsServiceMock,
    filteredProductsMock
} = require('../../utils/mocks/products.mocks');

const testServer = require('../../utils/testFunctions/testServer');

describe('routes - api - products', () => {

    const route = proxyquire('../../routes/api/products.routes', {
        "../../services/products.services": ProductsServiceMock
    });

    const request = testServer(route);

    describe('GET /products', () => {
        it('sohuld return all products with status 200', () => {
            return request.get('/api/products')
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.status).to.be.eql(200);
                    expect(res.body.data).to.be.an('array');
                });
        });

        it('sohuld return all products with status 200 where send tags in the url', () => {
            return request.get('/api/products?tags=expensive')
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.status).to.be.eql(200);
                    expect(res.body.data).to.be.an('array');
                });
        });

        it('should respond with content type json', () => {
            return request.get('/api/products')
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.headers, "Content-Type", /json/);
                });
        });

        it('should respondt with complete data of products', () => {
            return request.get('/api/products')
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.body.data).to.be.eql(productsMock)
                });
        });
    });

    describe('GET /products/id', () => {
        const getProductId = '6086d80640ef33219a01435c';
        const productObject = {
            "name": "Brown t-shirt",
            "price": "50",
            "image": "https://images.unsplash.com/photo-1533025625706-f321868a1e6c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=924b11607083a7d154547c4853d3eaa5&auto=format&fit=crop&w=800&q=60",
            "tags": ["expensive", "brown"]
        };

        it('should retun product with status 200', () => {
            return request.get(`/api/products/${getProductId}`)
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body.data).to.be.an('object');
                });
        });

        it('should respondt with content type json', () => {
            return request.get(`/api/products/${getProductId}`)
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.headers, "Content-Type", /json/);
                });
        });

        it('should respond with complete data of product', () => {
            return request.get(`/api/products/${getProductId}`)
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.body.data.name, productObject.name);
                })
        });
    });

    describe('POST /products', () => {

        const productObject = {
            name: "Brown boots",
            price: "90",
            image: "https://images.unsplash.com/photo-1521001750463-5f3e18f2da2d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=819e9dcb75b84114278a7163ff38a91c&auto=format&fit=crop&w=800&q=60",
            tags: ["brown", "expensive"]
        };

        const createProductId = '6bedb1267d1ca7f3053e2875';

        it('should respond with status 201', () => {
            return request.post('/api/products')
                .send(productObject)
                .expect(httpStatus.CREATED)
                .then(async(res) => {
                    expect(res.status).to.be.eql(201);
                    expect(res.body.data).to.be.an('string');
                });
        });

        it('should respond with content type json', () => {
            return request.post('/api/products')
                .send(productObject)
                .expect(httpStatus.CREATED)
                .then(async(res) => {
                    expect(res.headers, "Content-Type", /json/);
                });
        });

        it('should respond with not error', () => {
            return request.post('/api/products')
                .send(productObject)
                .expect(httpStatus.CREATED)
                .then(async(res) => {
                    expect(res.body.data).to.be.eql(createProductId)
                });
        });

    });

    describe('PUT /products', () => {
        const productObject = {
            name: "Brown boots",
            price: "90",
            image: "https://images.unsplash.com/photo-1521001750463-5f3e18f2da2d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=819e9dcb75b84114278a7163ff38a91c&auto=format&fit=crop&w=800&q=60",
            tags: ["brown", "expensive"]
        };

        const putProductId = '6086d7fa40ef33219a01435b';

        let bearerToken = config.testingAuthToken;

        it('should respond with error status 401', () => {
            return request.put(`/api/products/${putProductId}`)
                .send(productObject)
                .expect(httpStatus.UNAUTHORIZED)
                .then(async(res) => {
                    expect(res.status).to.be.eql(401);
                });
        });

        it('should respond with status 200', () => {
            return request.put(`/api/products/${putProductId}`)
                .set('Authorization', 'Bearer ' + bearerToken)
                .send(productObject)
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.status).to.be.eql(200);
                });
        }).timeout(20000);

        it('should respond with content type json', () => {
            return request.put(`/api/products/${putProductId}`)
                .set('Authorization', 'Bearer ' + bearerToken)
                .send(productObject)
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.headers).to.includes(/json/)
                });
        }).timeout(20000);

        it('should respond with not error', () => {
            return request.put(`/api/products/${putProductId}`)
                .set('Authorization', 'Bearer ' + bearerToken)
                .send(productObject)
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.body.data).to.be.eql(putProductId);
                });
        }).timeout(20000);


    });

    describe('PATCH /products', () => {
        const productObject = {
            name: "Brown boots",
            price: "90",
            image: "https://images.unsplash.com/photo-1521001750463-5f3e18f2da2d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=819e9dcb75b84114278a7163ff38a91c&auto=format&fit=crop&w=800&q=60",
            tags: ["brown", "expensive"]
        };

        const patchProductId = '6086d7fa40ef33219a01435b';

        let bearerToken = config.testingAuthToken;

        it('should respond with error status 401', () => {
            return request.patch(`/api/products/${patchProductId}`)
                .send(productObject)
                .expect(httpStatus.UNAUTHORIZED)
                .then(async(res) => {
                    expect(res.status).to.be.eql(401);
                });
        });

        it('should respond with status 200', () => {
            return request.patch(`/api/products/${patchProductId}`)
                .set('Authorization', 'Bearer ' + bearerToken)
                .send(productObject)
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.status).to.be.eql(200);
                });
        }).timeout(20000);

        it('should respond with content type json', () => {
            return request.patch(`/api/products/${patchProductId}`)
                .set('Authorization', 'Bearer ' + bearerToken)
                .send(productObject)
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.headers).to.includes(/json/)
                });
        }).timeout(20000);

        it('should respond with not error', () => {
            return request.patch(`/api/products/${patchProductId}`)
                .set('Authorization', 'Bearer ' + bearerToken)
                .send(productObject)
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.body.data).to.be.eql(patchProductId);
                });
        }).timeout(20000);


    });

    describe('DELETE /products', () => {
        const productObject = {
            name: "Brown boots",
            price: "90",
            image: "https://images.unsplash.com/photo-1521001750463-5f3e18f2da2d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=819e9dcb75b84114278a7163ff38a91c&auto=format&fit=crop&w=800&q=60",
            tags: ["brown", "expensive"]
        };

        const deleteProductId = '6086d7de40ef33219a01435a';

        let bearerToken = config.testingAuthToken;

        it('should respond with error status 401', () => {
            return request.delete(`/api/products/${deleteProductId}`)
                .expect(httpStatus.UNAUTHORIZED)
                .then(async(res) => {
                    expect(res.status).to.be.eql(401);
                });
        });

        it('should respond with status 200', () => {
            return request.delete(`/api/products/${deleteProductId}`)
                .set('Authorization', 'Bearer ' + bearerToken)
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.status).to.be.eql(200);
                });
        }).timeout(20000);

        it('should respond with content type json', () => {
            return request.delete(`/api/products/${deleteProductId}`)
                .set('Authorization', 'Bearer ' + bearerToken)
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.headers).to.includes(/json/)
                });
        }).timeout(20000);

        it('should respond with not error', () => {
            return request.delete(`/api/products/${deleteProductId}`)
                .set('Authorization', 'Bearer ' + bearerToken)
                .expect(httpStatus.OK)
                .then(async(res) => {
                    expect(res.body.data).to.be.eql(deleteProductId);
                });
        }).timeout(20000);

    });

});