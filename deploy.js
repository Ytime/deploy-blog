/**
 * Created by 风稻人 on 2017/4/27.
 */
let exec = require('child_process').exec,
    express = require('express'),
    app = express();

const PATH = './public',   //静态文件夹
    PORT = 3000; 


app.use(express.static(PATH));

//收到deploy，执行部署中间件
app.get('/deploy', deploy);


app.listen(PORT);

function deploy(req, res){
    var commands = ['cd ' + PATH, 'git pull origin master'].join(' && ');
    // git reset --hard origin/master
    // git clean -f
    // git pull
    // git checkout master

    exec(commands, function(err, out, code) {
        if (err) {
            res.writeHead(500);
            res.end('Server Internal Error.');
            return;
        }
        res.send('Deploy Done. ' + new Date());
    })
}

