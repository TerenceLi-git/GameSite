const express = require('express');
const app = express();
var path = require('path');
var bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

require('./routes/user')(app);
require('./routes/chessRoutes')(app);

app.use('/chess', express.static('Chess'));
app.use('/register', express.static('Register'));
app.use('/login', express.static('Login'));
app.use('/homepage', express.static('Homepage'));
app.use('/rng', express.static('RNG'));


module.exports = app;
