//Libs
const express = require('express');
const passport = require('passport');

//Middlewares
const validation = require('../../utils/middlewares/validationHandler.middleware');

//Services libs
const ProductsService = require('../../services/products.services');

//Schema validation
const {
    productIdSchema,
    productTagSchema,
    createProductSchema,
    updateProductSchema
} = require('../../utils/schemas/products.schema');

//JWT strategie
require('../../utils/auth/strategies/jwt');


/**
 * Test with Mocha
 */

function productsApi(app) {
    //Libs
    const router = express.Router();

    app.use("/api/products", router);

    //Services Instance Class 
    const productService = new ProductsService();

    /**
     * Routes
     *  - [GET] [ALL] products
     *  - [GET] [SINGLE] products
     *  - [POST] [SINGLE] product
     *  - [PUT] [SINGLE] product
     *  - [PATCH] [SINGLE] product
     *  - [DELETE] [SINGLE] product
     */
    router.get('/', async function(req, res, next) {
        const { tags } = req.query;

        try {
            const products = await productService.getProducts({ tags });

            res.status(200).json({
                data: products,
                message: 'products listed'
            });
        } catch (error) {
            next(error);
        }

    });

    router.get(
        '/:productId',
        validation({ productId: productIdSchema }, "params"),
        async function(req, res) {
            const { productId } = req.params;

            try {
                const product = await productService.getProduct({ productId });

                res.status(200).json({
                    data: product,
                    message: 'product retrieved'
                });
            } catch (error) {
                next(error);
            }
        }
    );

    router.post('/', (req, res, next) => {
            console.log(req.body);
            next();
        },
        validation(createProductSchema), async function(req, res) {
            const { body: product } = req;

            try {
                const createdProduct = await productService.createProduct({ product });

                res.status(201).json({
                    data: createdProduct,
                    message: 'product created'
                });
            } catch (error) {
                next(error);
            }
        });

    router.put(
        '/:productId',
        passport.authenticate("jwt", { session: false }),
        validation({ productId: productIdSchema }, "params"),
        validation(updateProductSchema),
        async function(req, res) {
            const { productId } = req.params;
            const { body: product } = req;

            try {
                const updatedProduct = await productService.updateProduct({ productId, product });

                res.status(200).json({
                    data: updatedProduct,
                    message: 'product updated'
                });
            } catch (error) {
                next(error);
            }
        }
    );

    router.patch(
        '/:productId',
        passport.authenticate("jwt", { session: false }),
        validation({ productId: productIdSchema }, "params"),
        async function(req, res, next) {
            const { productId } = req.params;
            const { body: changedAttributes } = req;

            try {
                const patchedProduct = await productService.patchProduct({ productId, changedAttributes });

                res.status(200).json({
                    data: patchedProduct,
                    message: 'product patched'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.delete(
        '/:productId',
        passport.authenticate("jwt", { session: false }),
        validation({ productId: productIdSchema }, "params"),
        async function(req, res) {
            const { productId } = req.params;

            try {
                const deletedProduct = await productService.deleteProduct({ productId });

                res.status(200).json({
                    data: deletedProduct,
                    message: 'product deleted'
                });
            } catch (error) {
                next(error);
            }
        }
    );
}

module.exports = productsApi;