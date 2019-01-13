const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

var server = http.createServer();
server.on('request', doRequest);

// ファイルモジュールを読み込む
var fs = require('fs');

// リクエストの処理
function doRequest(req, res) {
    const url = req.url
    const ext = url.split('.').slice(-1)[0]

    switch (ext) {
        case "/":
            // ファイルを読み込んだら、コールバック関数を実行する。
            fs.readFile('./Test.html', 'utf-8' , function(err, data){
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            })
        break
        case "js":
            fs.readFile("." + url, 'utf-8' , function(err, data){
                res.writeHead(200, {'Content-Type': 'text/javascript'});
                res.write(data);
                res.end();
            })
        break
    }
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
