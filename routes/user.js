const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const e = require('express');
const { reset } = require('nodemon');
var path = require('path');
const Users = require('../models/Users');

module.exports = app => {
    mongoose.set('useFindAndModify', false);

    app.get('/', async(req, res) => {
        try{
            res.sendFile(path.join(__dirname + '/../index.html'));
        }
        catch(err){
            console.log(err);
        }
    })
}