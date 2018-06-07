var http = require('http');
var fs = require('fs');

String.prototype.json_escape = function (){		//https://qiita.com/qoAop/items/777c1e1e859097f7eb82
    return ("" + this).replace(/\W/g, function (c){
        return "\\u" + ("000" + c.charCodeAt(0).toString(16)).slice(-4);
    });
};

					//https://github.com/broofa/node-mime
function getExtension(url){
	var parts = url.split('.');
	var extension = parts[parts.length-1];
	return extension;
};

console.log("");
console.log("localhost:8001 to listen");
console.log("");

var html1 = `
<!DOCTYPE html><html><head><title>テスト</title>
<script type='text/javascript' src='./myTextures.js'></script>
<script type='text/javascript'>
onload=function(){
	console.log("オッケー");
	SCREEN.innerText = '出来た';

	/** get context **/
	var canvas = document.getElementById('CANVAS');
	var gl=canvas.getContext("webgl2");
	if(!gl){
		alert('Unable to initialize WebGL.Your browser or machine may not support it.');
		return;
	}

	myTextures.changeRoot("./textures/");
	myTextures.join(gl,'earth');
	mytextures.earth.readFile('earth.png');





};
</script>
</head><body>
<div>できるかな？<p id="SCREEN"></p>
<canvas id="CANVAS" width=512 height=512></canvas>
</div></body></html>`;
//var script2 = `onload = function(){console.log("OK");};`;

/** server **/
http.createServer(function(req,res){

	var url = req.url.replace(/^\/$/,'\/index.html');// '/'->'/index.html'
	var extension = getExtension(url);
	console.log("extension=",extension,"url=",url);
	var script;
	switch(extension){
		case 'html':
		case 'htm':
			res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
			res.write(html1);
			res.end();
			res.finished;
			break;
		case 'ico':
			res.writeHead(200);
			res.end();
			break;
		case 'js':
			res.writeHead(200,{'Content-Type':'text/javascritpt'});
			script = fs.readFileSync('.'+url,'UTF-8');
			res.write(script);
			res.end();
			break;
		default:
	}
}).listen(8001,'127.0.0.1');




