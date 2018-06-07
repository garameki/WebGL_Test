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
<script type='text/javascript' src='./myShaders.js'></script>
<script type='text/javascript' src='./myFBOs.js'></script>
<script type='text/javascript' src='./shaders/drawTextureOnClipSpace.js'></script>
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

	myTextures.changeRoot("textures/");
	myTextures.join(gl,'earth');
	myTextures.earth.readFile("earth.png");

	for(var name in myTextures)console.log(name);
	myTextures.earth.readFile('earth.png');

//*************************** DRAW TEXTURE ON CLIP SPACE **********************************************

	var sNameShader ='drawTextureOnClipSpace';
	myShaders[sNameShader].attach(gl);
	myShaders[sNameShader].activate();
	myShaders[sNameShader].uniform["uSampler"].sendInt(0);
	myTextures.earth.activate(0);
	myShaders[sNameShader].attrib.aVertexPosition.assignArray([1,1,-1,1,1,-1,-1,-1],2);//four points of each corners of clip space
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

//**************************************** END ******************************************************************
// ****************************************************************************************************************




};
</script>
</head><body>
<div>できるかな？<p id="SCREEN"></p>
<canvas id="CANVAS" width=512 height=512></canvas>
</div></body></html>`;
//var script2 = `onload = function(){console.log("OK");};`;

/** server **/
//https://github.com/broofa/node-mime/blob/master/src/test.js

http.createServer(function(req,res){
	var url = req.url.replace(/^\/$/,'\/index.html');// '/'->'/index.html'
	var extension = getExtension(url);
	console.log("extension=",extension,"url=",url);
	var content;
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
			content = fs.readFileSync('.'+url,'UTF-8');
			res.write(content);
			res.end();
			break;
		case 'png':
			res.writeHead(200,{'Content-Type':'image/png'});
			content = fs.readFileSync('.'+url);
console.log("myTexture.test.node.js url=",url);
			res.write(content);
			res.end();
			break;
		default:
	}
}).listen(8000,'127.0.0.1');




