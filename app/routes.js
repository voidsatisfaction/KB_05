var post = require('./models/post');
var user = require('./models/user');
// image 업로드를 위해 multer라는 라이브러리를 씀
var multer = require('multer');

// multer의 설정
var image_upload = multer({
    dest: './public/uploads/'
});

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

    app.post('/api/new/post', image_upload.single('main_photo') ,function (req, res) {
        //새로운 post의 post요청이 들어오면
        // new_post 라는 새 post 객체를 만듬.
        var new_post = new post();
        // 그리고 post요청에서 html
        new_post.name = req.body.name;
        new_post.context = req.body.context;
        new_post.img_name = req.file.filename;

        console.log(new_post);
        new_post.save(function (err) {
            if(err)
                res.send(err);

            res.json({message: 'new post created'});
        })
    });

    // frontend routes =========================================================
    // 그외의 모든 요청에 대해서는
    app.get('/', function(req, res) {
        res.sendfile('./public/views/index.html'); // index.html 파일을 줌
    });

};
