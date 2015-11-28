var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PostSchema = new Schema({
    name : {type : String, default: ''},
    main_img : {type: String, default: ''},
    sub_imgs :{type: Array},
    context : {type : String, default: ''},
    user : String,
    click_count : Number,
    tag : Array
});

module.exports = mongoose.model('Post', PostSchema);
