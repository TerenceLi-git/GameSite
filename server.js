const express = require('express');
const app = express();
var path = require('path');

require('./routes/user')(app);

app.use('/chess', express.static('Chess'));

module.exports = app;
