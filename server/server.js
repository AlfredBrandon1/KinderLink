const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const server  = express();
const port = 8080;

// Middlewares
server.use( morgan('dev') );
server.use( cors() );
server.use( bodyParser.json() );
server.use( helmet() );

// Routes
const AuthRouter = require('./routes/auth');
 
// Routes
server.use('/api/v1/auth', AuthRouter);

//mongodb atlas connection
mongoose.connect('mongodb+srv://kinderlink:kinderlink@cluster0.t7zlntf.mongodb.net/?retryWrites=true&w=majority')
 
server.get('/', ( request, response ) => {
    response.send(`Welcome to ExpressJS`);
});
 
server.listen(port, () => {
    console.log(`Server running on port ${ port }`);
});