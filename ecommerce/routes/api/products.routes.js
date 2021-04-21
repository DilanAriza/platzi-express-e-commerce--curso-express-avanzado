// Libs
const express = require('express');
const router = express.Router();

//Middlewares
const validation = require('../../utils/middlewares/validationHandler.middleware');

//Services libs
const ProductsService = require('../../services/products.services');

//Services Instance Class 
const productService = new ProductsService();

//Schema validation
const {
    productIdSchema,
    productTagSchema,
    createProductSchema,
    updateProductSchema
} = require('../../utils/schemas/products.schema');


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
    console.log('req', req.query);

    try {
        const products = await productService.getProducts({ tags })

        res.status(200).json({
            data: products,
            message: 'product listed'
        })
    } catch (error) {
        next(error);
    }

});

router.get(
    '/:productId',
    validation({ productId: productIdSchema }, "params"),
    async function(req, res) {
        const { productId } = req.params;
        console.log('req', req.params);

        try {
            const product = await productService.getProduct({ productId })

            res.status(200).json({
                data: product,
                message: 'product retrieved'
            })
        } catch (error) {
            next(error);
        }
    }
);

router.post('/', (req, res, next) => {
        console.log(req.body)
        next();
    },
    validation(createProductSchema), async function(req, res) {
        const { body: product } = req;
        console.log('req', req.params);

        try {
            const createdProduct = await productService.createProduct({ product })

            res.status(201).json({
                data: createdProduct,
                message: 'product created'
            })
        } catch (error) {
            next(error);
        }
    });

router.put(
    '/:productId',
    validation({ productId: productIdSchema }, "params"),
    validation(updateProductSchema),
    async function(req, res) {
        const { productId } = req.params;
        console.log('req', req.params);
        const { body: product } = req;

        try {
            const updatedProduct = await productService.updateProduct({ productId, product })

            res.status(200).json({
                data: updatedProduct,
                message: 'product updated'
            })
        } catch (error) {
            next(error);
        }
    }
);

router.patch(
    '/:productId',
    validation({ productId: productIdSchema }, "params"),
    async function(req, res, next) {
        const { productId } = req.params
        console.log('req', req.params)
        const { body: changedAttributes } = req

        try {
            const patchedProduct = await productService.patchProduct({ productId, changedAttributes })

            res.status(200).json({
                data: patchedProduct,
                message: 'product patched'
            })
        } catch (err) {
            next(err)
        }
    }
);

router.delete(
    '/:productId',
    validation({ productId: productIdSchema }, "params"),
    async function(req, res) {
        const { productId } = req.params;
        console.log('req', req.params);

        try {
            const deletedProduct = await productService.deleteProduct({ productId })

            res.status(200).json({
                data: deletedProduct,
                message: 'product deleted'
            })
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;