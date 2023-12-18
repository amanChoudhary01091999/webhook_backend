const express = require('express')
const app = express()

//Package for error handeling
const morgan = require('morgan')

//Package for parsing body/post request
const bodyParser = require('body-parser')


const productRoutes = require("./routes/products")
const orderRoutes = require("./routes/orders")
const employeeRoutes = require("./routes/employees")
const userRoutes = require("./routes/user")
const todoRoute = require("./routes/todoList")
const bitbucket = require("./routes/bitbucket")

const uri = 'mongodb+srv://amanchoudhary0109official:mzI9UB4TlyrTlcg1@cluster0.n9ldbai.mongodb.net'
// Connecting with database
const mongoose = require('mongoose')
// mongoose.connect('mongodb+srv://amanchoudhary0109official:mzI9UB4TlyrTlcg1@cluster0.n9ldbai.mongodb.net/', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('Connected to MongoDB Atlas');

//     })
//     .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

app.use(morgan('dev'))
//which kind of bodies we need to parse should be defined
app.use(bodyParser.urlencoded({ extended: false }))//extended true allows rich data text 
app.use(bodyParser.json())

//adding headers for CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Header', "*")
    if (res.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,PATCH,GET')
        return res.status(200).json({})
    }
    next()

})

//Routes to handle requst 
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/employees', employeeRoutes)
app.use("/user", userRoutes)
app.use("/todos", todoRoute)
app.use("/bitbucket", bitbucket)
//Error handeling in node.js
//Written after app.use() bcoz error haapens when no routers could handle the request..

//when the end point is not found
app.use((res, req, next) => {
    const error = new Error('Not Found')
    error.status = 404;
    next(error)
})

// For handeling every other sorts of error
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app

