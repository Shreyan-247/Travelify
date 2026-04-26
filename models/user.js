const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    email : {
        type:String,
        required:true,
    }
});

User.plugin(passportLocalMongoose.default || passportLocalMongoose);

module.exports = mongoose.model('User', User);