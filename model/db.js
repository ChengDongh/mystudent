var setting = require('../settings');
//引入mongodb模块的Db对象
var Db = require('mongodb').Db;
//引入mongodb模块的Server对象
var Server = require('mongodb').Server;
//数据库的实例对象
module.exports = new Db(setting.db,new Server(setting.host,setting.port),{safe:true})