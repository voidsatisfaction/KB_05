var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    name : String,
    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    stars: Array
});


UserSchema.methods.validPassword = function(password) {
    if(password== this.local.password){
        console.log('true');
        return true;
    }else{
        return false;
    }
};

module.exports = mongoose.model('User', UserSchema);
