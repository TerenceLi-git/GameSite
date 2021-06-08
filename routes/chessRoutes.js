const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const e = require('express');
const { reset } = require('nodemon');
var path = require('path');
const Users = require('../models/Users');
const Chess = require('../models/Chess');
const { Console } = require('console');

module.exports = app => {
    mongoose.set('useFindAndModify', false);

    app.post('/saveChess', async(req, res) => {
        try{
            const tempid = req.body.id;
            const tempchessBoard = req.body.chessBoard;
            const tempturn = req.body.turn;

            console.log(tempchessBoard);
            
            Chess.findOne({id: tempid}, async function(err, chess){
                if(!chess){
                    const newChessSave = new Chess();

                    newChessSave.id = tempid;
                    newChessSave.chessBoard = tempchessBoard;
                    newChessSave.turn = tempturn;

                    const retChess = await newChessSave.save();
                    res.send("Initial Saved");
                }
                else{
                    try{
                        Chess.findOneAndUpdate({id : tempid}, {"chessBoard": tempchessBoard, "turn": tempturn}, async function(err, chess){
                            res.send("Update Saved");
                        })
                    }
                    catch(err){
                        console.log(err);
                        res.sendStatus(404);
                    }
                }
            })
        }
        catch(err){
            console.log(err);
            res.sendStatus(404);
        }
    })

    app.post('/getChess' , async(req,res)=>{
        try{
            const tempid = req.body.id;

            const chessBoard = await Chess.findOne({id: tempid});
            console.log(chessBoard.chessBoard);
            res.send(chessBoard);
        }
        catch(err){
            res.sendStatus(400);
        }
    })
}