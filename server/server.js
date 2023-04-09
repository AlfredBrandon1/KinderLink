require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const server = express();
const port = process.env.PORT || 8080;

// Middlewares
server.use(morgan('dev'));
server.use(cors());
server.use(bodyParser.json());
server.use(helmet());

// Enable CORS for all routes
server.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Routes initialization
const AuthRouter = require('./routes/auth');
const TeacherRouter = require('./routes/teacher');

// Routes
server.use('/api/v1/auth', AuthRouter);
server.use('/api/v1/teacher', TeacherRouter);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  server.use(express.static(path.join(__dirname, 'client/build')));

  // Catch all routes and return index.html
  server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
} else {
  server.get('/', (request, response) => {
    response.send(`Welcome to the backend server of KinderLink`);
  });
}

//mongodb atlas connection
mongoose.connect("mongodb+srv://kinderlink:kinderlink@cluster0.t7zlntf.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

server.listen(port, () => {
  console.log(`Server running on port ${ port }`);
});
