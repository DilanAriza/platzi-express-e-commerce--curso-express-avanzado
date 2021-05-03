const express = require('express');
const { config } = require('../../config');

const ProductsService = require('../../services/products.services');


function productsRouter(app) {
    //Libs
    const router = express.Router();
    app.use("/products", router);

    const productService = new ProductsService();

    router.get('/', async function(req, res, next) {
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