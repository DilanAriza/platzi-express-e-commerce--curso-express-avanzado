// Libs
const express = require('express');
const path = require('path');
const Boom = require('@hapi/boom');
const debug = require('debug')("app:server")

//Routes
const productsRouter = require('./routes/views/products.view'); // View Products
const productsApiRouter = require('./routes/api/products.routes'); // Api Products
const authApiRouter = require('./routes/api/auth.routes'); // Api Auth

// Errors middlwares
const {
    logErrors,
    wrapErrors,
    clientErrorHandler,
    errorHandler
} = require('./utils/middlewares/errorsHandlers.middleware')

const isRequestAjaxOrApi = require('./utils/singleUtils/isRequestAjaxOrApi');
const authApi = require('./routes/api/auth.routes');

//app
const app = express();

// MIDDLWARES
//Json API Integred
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

//Static files
app.use("/static",
    express.static(
        path.join(__dirname, "public")
    )
);

//Engine views
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "pug");

//Routes
productsRouter(app);
productsApiRouter(app);
authApi(app);

//Redirect
app.get('/', function(req, res) {
    res.redirect("/products");
});

// 404 error with boom or default function
app.use(function(req, res, next) {
    if (isRequestAjaxOrApi(req)) {
        const {
            output: { statusCode, payload }
        } = Boom.notFound();

        res.status(statusCode).json(payload);
    }

    res.status(404).render("404");
});

//Errors handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);
app.use(errorHandler);



//Server init
const server = app.listen(8000, function() {
    debug(`Listening http://localhost:${server.address().port}`);
})