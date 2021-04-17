const express = require('express');
const router = express.Router();

const ProductsService = require('../../services/products.services');

const productService = new ProductsService();

router.get('/', async function(req, res, next) {
    const { tags } = req.query

    console.log('req', req.query)

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

router.get('/:productId', async function(req, res) {
    const { productId } = req.params
    console.log('req', req.params)

    try {
        const product = await productService.getProduct({ productId })

        res.status(200).json({
            data: product,
            message: 'product retrieved'
        })
    } catch (error) {
        next(error);
    }
});

router.post('/', async function(req, res) {

    const { body: product } = req;
    console.log('req', req.params)

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

router.put('/:productId', async function(req, res) {

    const { productId } = req.params;
    console.log('req', req.params)
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
});

router.patch('/:productId', async function(req, res, next) {
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
})

router.delete('/:productId', async function(req, res) {

    const { productId } = req.params;
    console.log('req', req.params)
    try {
        const deletedProduct = await productService.updateProduct({ productId })

        res.status(200).json({
            data: deletedProduct,
            message: 'product deleted'
        })
    } catch (error) {
        next(error);
    }
});

module.exports = router;