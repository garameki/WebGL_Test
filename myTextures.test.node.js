var http = 	require('http');
var fs = 	require('fs');
//var PNG = 	require('pngjs').PNG;


function getExtension(url){
	var parts = url.split('.');
	var extension = parts[parts.length-1];
	return extension;
};

console.log("");
console.log("localhost:8001 to listen");
console.log("");

/**  html & javascript **/
var html1 = `
<!DOCTYPE html><html><head><title>テスト</title>
<script type='text/javascript' src='./myShaders.js'></script>
<script type='text/javascript' src='./myFBOs.js'></script>
<script type='text/javascript' src='./shaders/drawTextureOnClipSpace.js'></script>
<script type='text/javascript' src='./myTextures.js'></script>
<script type='text/javascript' src='./myColorName.js'></script>
<script type='text/javascript'>
onload=function(){

	/** get context **/
	var canvas = document.getElementById('CANVAS');
	var gl=canvas.getContext("webgl2");
	if(!gl){
		alert('Unable to initialize WebGL.Your browser or machine may not support it.');
		return;
	}

	/** set context **/
	gl.viewport(0,0,512,512);//(kkk bad)クリップ空間の-1～1の値をcanvasの大きさに変換する

	gl.clearColor(0.0, 0.0, 0.0, 0.5);
	gl.clear(gl.COLOR_BUFFER_BIT);

	var d0x1i = 1/0xFFFFFF;// decimal of 0x1 to inverse
	function h24toD(a){
		return a*d0x1i;
	};
	gl.enable(gl.DEPTH_TEST);
	gl.clear(h24toD(0xFFFFFF));// 1.0 
	gl.clear(gl.DEPTH_BUFFER_BIT);
	gl.depthFunc(gl.LEQUAL);

	var ROOT = 'textures/';
	var FILENAME = 'earth.png';

	/** prepare texture **/
	myTextures.changeRoot(ROOT);
	myTextures.join(gl,'example');
	myTextures.example.readFile(FILENAME);
			
	/** prepare shader **/
	var sNameShader ='drawTextureOnClipSpace';
	myShaders[sNameShader].attach(gl);
	myShaders[sNameShader].activate();
	myShaders[sNameShader].attrib.aVertexPosition.assignArray([1,1,-1,1,1,-1,-1,-1],2);//four points of each corners of clip space
	myShaders[sNameShader].uniform["uSampler"].sendInt(0);
	myTextures.example.activate(0);

	/** wait for loading image to render **/
	var countHoge =0;
	var hoge = setInterval(function(){
		if(myTextures.example.readyImage){
			clearInterval(hoge);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);//render
		}else if(++countHoge>100){
			clearInterval(hoge);
			console.error("Image have not been ready for 0.1 second.");
		};	
	},1);

	/** recognize by HTML Image **/
	var image = new Image();
	image.src = ROOT+FILENAME;
	image.onload = function(){
		DIV2.appendChild(image);
	};



};
</script>
</head><body>
<div>
texture is here<br>
<canvas id="CANVAS" width="512" height="512"></canvas>
</div>
<div id="DIV2">
image is here<br>
</div></body></html>`;
// EOF


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

			content = fs.readFileSync('.'+url);
			//content = PNG.sync.read(content);//https://www.npmjs.com/package/pngjs#sync-api
			//content = JSON.stringify(content);
			res.writeHead(200,{'Content-Type':'image/png'});
			res.write(content);
			res.end();
			break;
		default:
	}
}).listen(8000,'127.0.0.1');




