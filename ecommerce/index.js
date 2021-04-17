// Libs
const express = require('express');
const path = require('path');

//Routes
const productsRouter = require('./routes/views/products.view'); // View Products
const productsApiRouter = require('./routes/api/products.routes'); // Api Products

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
)

//Engine views
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "pug");

//Redirect
app.get('/', function(req, res) {
    res.redirect('/products');
})

//Render routes
app.use('/products', productsRouter);
app.use("/api/products", productsApiRouter);

//Server init
const server = app.listen(8000, function() {
    console.log(`Listening http://localhost:${server.address().port}`);
})