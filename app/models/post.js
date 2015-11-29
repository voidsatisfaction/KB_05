var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PostSchema = new Schema({
    name : {type : String, default: ''},
    main_img : {type: String, default: ''},
    sub_imgs :{type: Array},
    context : {type : String, default: ''},
    user : String,
    buyCount : {type : Number, default: 0},
    tag : Array
});

module.exports = mongoose.model('Post', PostSchema);
