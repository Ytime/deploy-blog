/**
 * Created by 风稻人 on 2017/4/27.
 */
var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    mime = require('./mime.json'),
    exec = require('child_process').exec;

const PATH = './public',   //静态文件夹
    PORT = 4000;             

http.createServer(function (req, res) {

    var pathname = url.parse(req.url).pathname;

    //收到deploy，执行部署
    if (pathname == '/deploy') {

        var commands = ['cd ' + PATH, 'git pull origin master'].join(' && ');
        // git reset --hard origin/master
        // git clean -f
        // git pull
        // git checkout master

        exec(commands, function(err, out, code) {
            if (err) {
                res.writeHead(500);
                res.end('Server Internal Error.');
                throw err;
            }
            res.writeHead(200);
            console.log('Deploy Done. ' + new Date());
            res.end('Deploy Done.');
        })
    }
    else {
        //处理其他请求，静态托管 public文件夹
        var extname = path.extname(pathname);
        //无拓展名默认加载index.html
        if ('' == extname){
            pathname = decodeURI(path.join(pathname, '/index.html'));
        }
        //读取对应文件
        fs.readFile(PATH + pathname, function (err, data) {
            //出错返回404页面
            if (err){
                res.end('404');
                res.writeHead(404,{'Conten-Type': mime['.html']});
                return
            }
            res.writeHead(200,{'Conten-Type': mime[extname]});
            res.end(data);
        })
    }
    
}).listen(PORT);

