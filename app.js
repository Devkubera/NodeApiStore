const express = require('express')
const logger = require('morgan')
var cookieParser = require('cookie-parser');
require('dotenv').config()
require('./db')

// local module
const loginRoute = require('./routes/login')
const productRoute = require('./routes/product')
const orderRoute = require('./routes/orders')

// initialize
const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// use for serve any file to show result when routing such as HTML file etc.
// app.use(express.static(path.join(__dirname, 'public')));

// route is here
app.use('/api/v1', loginRoute)
app.use('/api/v1', productRoute)
app.use('/api/v1', orderRoute)

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.error('error to start server: ', error)
    }
    console.log("Server listening on PORT: ", process.env.PORT);
})

module.exports = app