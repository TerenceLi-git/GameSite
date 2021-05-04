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

    app.post('/signup', async(req, res) => {
        try{
            const email = req.body.email;
            const password = req.body.password;
            const fName = req.body.firstName;
            const lName = req.body.lastName;
            const birthdate = req.body.birthdate;
    
            Users.findOne({email: email}, async function(err, user){
                if(!user){
                    const newUser = new Users();
                    newUser.firstName = fName;
                    newUser.lastName = lName;
                    newUser.email = email;
                    newUser.birthdate = birthdate;
                    newUser.password = bcrypt.hashSync(password, 12);
    
                    const retUser = await newUser.save();
                    res.send(retUser);
                }
                else{
                    res.sendStatus(404);
                }
            })
        }
        catch (err){
            console.log("Pain incoming.");
            res.sendStatus(400);
        }
    })

    app.post('/login', async(req, res) => {
        try{
            const email = req.body.email;
            const password = req.body.password;

            Users.findOne({email: email}, async function(err, user){
                if (!user) {
                    res.sendStatus(404)
                    console.log("user does not exist");
                } else {
                    if(err || !bcrypt.compareSync(password, user.password)){
                        res.sendStatus(404);
                        console.log("password error");
                    } else {
                        console.log("redirecting");
                        res.send(user);
                    }
                }
            })
        }
        catch (err){
            console.log("Pain incoming.");
            res.sendStatus(400);
        }
    })
}