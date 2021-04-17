// Libs
const express = require('express');
const app = express();
const path = require('path');

//Middlwares
app.use("/static",
    express.static(
        path.join(__dirname, "public")
    )
)
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

//Engine views
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "pug");

//Routes files
const productsRouter = require('./routes/products');
const productsApiRouter = require('./routes/api/products');

app.get('/', function(req, res, next) {
    res.send({ Hello: "World" });
})

//Render routes
app.use('/products', productsRouter);
app.use("/api/products", productsApiRouter);

const server = app.listen(8000, function() {
    console.log(`Listening http://localhost:${server.address().port}`);
})