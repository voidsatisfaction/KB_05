var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PostSchema = new Schema({
    name : {type : String, default: ''},
    main_img : {type: String, default: ''},
    sub_imgs :{type: [String]},
    context : {type : String, default: ''}
});

module.exports = mongoose.model('Post', PostSchema);
