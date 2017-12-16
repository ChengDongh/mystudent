var Post = require('../model/Post');
module.exports = function (app) {
    //首页
    app.get('/',function (req,res) {
        // var sort = parseInt(req.query.sort)||1;
        var page = parseInt(req.query.page)||1;
        Post.getSix(null,page,function (err,docs,total) {
            if(err){
                return res.redirect('/');
            }
            res.render('index',{
                title:'首页',
                page:page,
                isFirst:(page - 1)*6 == 0,
                isLast:(page - 1)*6 + docs.length == total,
                docs:docs
            })
        })
    })
    //添加信息
    app.get('/add',function (req,res) {
        res.render('add',{
            title:'添加'
        })
    })
    //添加行为
    app.post('/add',function (req,res) {
        var username = req.body.username;
        var name = req.body.name;
        var tel = req.body.tel;
        var email = req.body.email;
        var newPost = new Post({
            username:username,
            name:name,
            tel:tel,
            email:email
        })
        newPost.save(function (err,user) {
            if(err){
                return res.redirect('/');
            }
            return res.redirect('/');
            console.log('14111');
        })
    })
    //修改
    app.get('/edit/:name/:time',function (req,res) {
        Post.edit(req.params.name,req.params.time,function (err,doc) {
            if(err){
                return res.redirect('/')
            }
            return res.render('edit',{
                title:'修改信息',
                doc:doc
            })
        })
    })
    //修改行为
    app.post('/edit/:name/:time',function (req,res) {
        var user = req.body.username;
        var tel = req.body.tel;
        var email = req.body.email;
        console.log(req.params.name);
        Post.update(req.params.name,req.params.time,user,tel,email,function (err,doc) {
            if(err){
                return res.redirect('/');
            }
            return res.redirect('/');
        })
    })
    //删除
    app.get('/remove/:time',function (req,res) {
        Post.remove(req.params.time,function (err) {
            if(err){
                return res.redirect('/');
            }
            return res.redirect('/');
        })
    })
    //搜索
    app.get('/search',function (req,res) {
        Post.search(req.query.keyword,function (err,docs) {
            if(err){
                return res.redirect('/')
            }
            return res.render('search',{
                title:'搜索结果',
                docs:docs
            })
        })
    })
}
