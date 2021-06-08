const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');


 const UsersSchema = new mongoose.Schema({
   id: {
     type: ObjectId,
     required: true,
     default :"",
   },

   chessBoard:{
     type : Array,
     required: true,
     default :"",
   },

   turn:{
     type : String,
     required: true,
     default :"",
   }

 });
 UsersSchema.plugin(timestamp);

 const Chess = mongoose.model('Chess',UsersSchema);
 module.exports = Chess
