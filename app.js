const express = require('express');
const app = express();
const morgan = require('morgan')
const Mongoose = require('mongoose')
const wordsRoute = require('./api/routes/words')
const userRoutes = require('./api/routes/user')
const sermonsRoute = require('./api/routes/sermons')
const home = require('./api/routes/home')
const BodyParser = require('body-parser')

//connecting to mongoose
// var connDb = "mongodb+srv://felixphero:" + process.env.MONGO_ATLAS_PW + "@lingalaapi-nqe48.mongodb.net/test?retryWrites=true"
Mongoose.connect('mongodb+srv://felixphero:felix@shopping-api-7z8bq.mongodb.net/test?retryWrites=true', { useNewUrlParser: true })

Mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.json())

//regulate access to clients by Avoiding Course Errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'origin,X-Reqeted-With,Content-type,Accept,Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({});
    }
    next();
})


//routes
app.use('/words', wordsRoute)
app.use('/users', userRoutes)
app.use('/sermons', sermonsRoute)
app.use('/', home)



//error definition middleware
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})
module.exports = app