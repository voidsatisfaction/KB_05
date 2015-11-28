var post = require('./models/post');
var user = require('./models/user');
// image 업로드를 위해 multer라는 라이브러리를 씀
var multer = require('multer');
var fs = require('fs');
var path = require('path');

// multer의 설정
var image_upload = multer({
    dest: './public/uploads/'
});



var sub_images = [];
module.exports = function(app) {

    // server routes ===========================================================

    app.post('/api/new/user', function (req, res) {
        var new_user = new user();

        new_user.name = req.body.user_name;
        new_user.save(function (err) {
            res.json('success new user');
        });
    });

    // /api/posts의 get event가 발생한다면
    app.get('/api/posts', function(req, res) {
        // post를 검색 그후 callback 함수에 posts의 인자 전달
        post.find(function(err, posts) {
            if (err)
                res.send(err);

            res.json(posts); // 모든 post를 json형태로 전달. view는 나중에 angular에서 처리
        });
    });

    app.post('/api/new/post', function (req, res) {
        console.log('new post');

        var new_post = new post();
        // 그리고 post요청에서 html
        new_post.name = req.body.name;
        new_post.context = req.body.context;
        new_post.sub_imgs = sub_images;
        sub_images = [];

        console.log(new_post);
        new_post.save(function (err) {
            if(err)
                res.send(err);
            res.json({message: 'new post created'});
        });
    });

    app.post('/api/new/photo' ,function (req, res) {
        console.log('new photo post');
        var buf = new Buffer(req.body.blob, 'base64'); // decode

        var file_name = makeid();
        console.log("file_name " + file_name);
        fs.writeFile(path.join(__dirname, '../public/uploads/' + file_name ), buf, function(err) {
            if(err) {
                console.log("err", err);
            } else {
                var push_file = {tag: req.body.tag , file_name : file_name};
                sub_images.push(push_file);
                console.log(sub_images);
                return res.send(file_name);
            }
        });


        function makeid() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 10; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }
    });

    // frontend routes =========================================================
    // 그외의 모든 요청에 대해서는
    app.get('/', function(req, res) {
        res.sendfile('./public/views/index.html'); // index.html 파일을 줌
    });

};



