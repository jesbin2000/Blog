const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const adminSchema = new Schema({
    adminName: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
    }
});

const user = mongoose.model('user',adminSchema);
module.exports = admin;
