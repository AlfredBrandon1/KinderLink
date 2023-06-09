require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const server = express();
const port = 8080;

// import routers
const AuthRouter = require('./routes/auth');
const TeacherRouter = require('./routes/teacher');
const StudentRouter = require('./routes/student');
const AnnouncementRouter = require('./routes/announcement');
const ReportCardRouter = require('./routes/reportCard');


// Middlewares
server.use(morgan('dev'));
server.use(cors());
server.use(bodyParser.json());
server.use(helmet());

let apiUrl = '';

if (process.env.NODE_ENV === 'production') {
  apiUrl = 'https://kinderlink.onrender.com/api/v1/';
} else {
  apiUrl = 'http://127.0.0.1:5173/api/v1/';
}

// Enable CORS for all routes
server.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//mongodb atlas connection
mongoose.connect("mongodb+srv://kinderlink:kinderlink@cluster0.t7zlntf.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Routes
server.use('/api/v1/auth', AuthRouter);
server.use('/api/v1/teacher', TeacherRouter);
server.use('/api/v1/student', StudentRouter);
server.use('/api/v1/announcement', AnnouncementRouter);
server.use('/api/v1/reportCard', ReportCardRouter);

  // Serve static files from React app
server.use(express.static(path.join(__dirname, 'client')));

server.get('/*', (request, response) => {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, () => {
  console.log(`Server running on port ${ port }`);
});
