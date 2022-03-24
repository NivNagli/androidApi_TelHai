/* local libraries */
const path = require('path');
const fs = require('fs');

/* global libraries */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
app.use(bodyParser.json());

const userRoutes = require('./routes/authentication');
const orderRoutes = require('./routes/order');

/* CORS PERMISSION'S */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/user', userRoutes);
app.use('/order', orderRoutes);

/* Super 'Catcher' for errors handling */
// Not all errors will be handled by this middleware there is some methods who will handle the errors by themselves.
app.use((error, req, res, next) => {
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
  });
  mongoose
    .connect(
      `mongodb+srv://androaidProject:Hayot123@androaidproject.oluz4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    )
    .then(result => {
      app.listen(process.env.PORT || 8081);
    })
    .catch(err => console.log(err));
