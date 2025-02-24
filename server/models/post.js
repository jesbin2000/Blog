const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const postSchema = new Schema({
    title : {
        type:String,
        required:true
    },
    body : {
        type:String,
        required:true
    },
    createdAt : {
        type:Date,
        default:Date.now
    },
    updatedAt : {
        type:Date,
        default:Date.now
    }
});

 const post = mongoose.model('post',postSchema);
module.exports = post
