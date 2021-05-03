const express = require('express');
const { config } = require('../../config');

const ProductsService = require('../../services/products.services');

//Functions
const cacheResponse = require('../../utils/singleUtils/cacheResponse');
const {
    FIVE_MINUTES_IN_SECONDS,
    SIXTY_MINUTES_IN_SECONDS
} = require('../../utils/singleUtils/time');

function productsRouter(app) {
    //Libs
    const router = express.Router();
    app.use("/products", router);

    const productService = new ProductsService();

    router.get('/', async function(req, res, next) {

        cacheResponse(res, FIVE_MINUTES_IN_SECONDS);

        const { tags } = req.query;

        (tags) ? tagsArray = tags.split(','): tagsArray = [];

        try {
            const products = await productService.getProducts({ tagsArray });
            res.render("products", { products, dev: config.dev });

        } catch (err) {
            console.log(err);
            next(err);
        }
    });
}

module.exports = productsRouter;