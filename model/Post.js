var mongodb = require('./db');

function Post(user) {
    this.username = user.username;
    this.name = user.name;
    this.tel = user.tel;
    this.email = user.email;
}

function formaDate(num) {
    return num < 10 ? '0' + num : num;
}

//添加
Post.prototype.save = function (callback) {
    var data = new Date();
    var now = data.getFullYear() + '-' + formaDate(data.getMonth() + 1) + '-' + formaDate(data.getDate()) + ' ' + formaDate(data.getHours()) + ':' + formaDate(data.getMinutes()) + ':' + formaDate(data.getSeconds());
    var user = {
        username: this.username,
        name: this.name,
        tel: this.tel,
        email: this.email,
        time: now
    }
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.insert(user, {safe: true}, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user);
            })
        })
    })
}
//显示信息
Post.getSix = function (name, page, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {}
            if (name) {
                query.name = name;
            }
            collection.count(query, function (err, total) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                collection.find(query, {
                    skip: (page - 1) * 6,
                    limit: 6
                }).sort({time: -1}).toArray(function (err, docs) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, docs, total);
                })
            })

        })
    })
}
//修改
Post.edit = function (name, time, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                name: name,
                time: time
            }, function (err, doc) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                return callback(null, doc);
            })
        })
    })
}
Post.update = function (name, time, user, tel, email, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close;
                return callback(err);
            }
            collection.update({
                name: name,
                time: time
            }, {$set: {username: user, tel: tel, email: email}}, function (err, doc) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                return callback(null, doc)
            })
        })
    })
}
// 删除
Post.remove = function (time, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err)
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.remove({
                time: time,
            }, {
                w: 1
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                return callback(null)
            })
        })
    })
}
//搜索
Post.search = function (keyword,callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err)
        }
        db.collection('posts', function (err,collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var newWord = new RegExp(keyword,'i');
            collection.find({
                username: newWord
            }, {
                username: 1,
                name: 1,
                tel: 1,
                email: 1,
                time: 1
            }).sort({time: -1}).toArray(function (err,docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                return callback(null,docs);
            })
        })
    })
}
module.exports = Post;
