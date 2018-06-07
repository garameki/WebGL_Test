var http = require('http');
var fs = require('fs');

String.prototype.json_escape = function (){		//https://qiita.com/qoAop/items/777c1e1e859097f7eb82
    return ("" + this).replace(/\W/g, function (c){
        return "\\u" + ("000" + c.charCodeAt(0).toString(16)).slice(-4);
    });
};

console.log("");
console.log("localhost:8001 to listen");
console.log("");

var html1 = `
<!DOCTYPE html><html><head><title>テスト</title>
<script type='text/javascript' src='./myTextures.js'></script><script type='text/javascript'>onload=function(){console.log("オッケー");};</script>
</head><body><div><p id=\'SCREEN\'></p></div>出来た</body></html>`;
var script1 = fs.readFileSync('./myTextures.js','UTF-8');
var script2 = `onload = function(){console.log("OK");};`;

/** server **/
http.createServer(function(req,res){


//	console.log("requested=",req);
	console.log("requested=",req.url.replace(/^\/$/,'index.html').split('.'));
//	console.log("html1=",html1);
	switch(req.url){
		case '/':
		case '/index.html':
		case '/index.htm':
			res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
			res.write(html1);
			res.end();
			res.finished;
			break;
		case '/favicon.ico':
			res.writeHead(200);
			res.end();
			break;
		case '/myTextures.js':
			res.writeHead(200,{'Content-Type':'text/javascritpt'});
			res.write(script1);
			res.end();
			break;
		default:
	}
}).listen(8001,'127.0.0.1');




