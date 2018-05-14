/**
 *	物体の影を任意の平面に落とします
 *	To make a object its shadow putting on a arbitrary plane 
**/

var temp = {

	/** BLEND **/
	gl.disable(gl.BLEND);
//	gl.enable(gl.BLEND);//後に描かれたものが前に描かれたものとブレンドされる//https://sites.google.com/site/hackthewebgl/learning-webglhon-yaku/the-lessons/lesson-8
				//---> ①奥の太陽②手前の輪---○　①手前の輪②奥の太陽---X
//	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
//	gl.blendFunc(gl.ONE_MINUS_SRC_ALPHA,gl.SRC_ALPHA);
//	gl.blendFunc(gl.SRC_ALPHA,gl.ONE);


//●	gl.blendFunc(gl.,gl.);//destinationの黒い部分には黒色を付けない

	/** COLOR **/
//	gl.clearColor(0,0,0,0);
//	gl.clear(gl.COLOR_BUFFER_BIT);

	/** DEPTH **/
	gl.disable(gl.DEPTH_TEST);
//	gl.enable(gl.DEPTH_TEST);
//	gl.clearDepth(c24(0x0));
//	gl.clear(gl.DEPTH_BUFFER_BIT);
	gl.depthFunc(gl.NOTEQUAL);

	/** STENCIL **/
//	gl.disable(gl.STENCIL_TEST);
	gl.enable(gl.STENCIL_TEST);
//	gl.clearStencil(0xFF);
//	gl.clear(gl.STENCIL_BUFFER_BIT);
	gl.stencilFunc(gl.EQUAL,0xFE,0xFF);
	gl.stencilOp(gl.KEEP,gl.KEEP,gl.REPLACE);
//	gl.stencilOp(gl.KEEP,gl.REPLACE,gl.KEEP);
//	gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);

};

(function(){

var sNameOfShader = "drawShadowOnPlane";

var fs = (function(){/*

	uniform sampler2D uSampler;

	varying lowp vec2 vTextureCoord;

	void main(void) {

		highp float hh = gl_FragColor.r;
		if(hh > 0.0/255.0 ){
			discard;
		}else{
			gl_FragColor = vec4(texture2D(uSampler,vTextureCoord).rgb,1.0);
		}
	}
*/});

var vs = (function(){/*
//土星をリング平面に写像 reposition the point of surface of saturn onto the ring plane

	attribute vec3 aVertexPosition;//x y z
	attribute vec2 aTextureCoord;//x y

	uniform mat4 uPerspectiveMatrix;
	uniform mat4 uModelViewMatrix;
	uniform mat4 uModelViewMatrixInversedTransposed;
	uniform mat4 uManipulatedMatrix;

	varying lowp vec2 vTextureCoord;//本来要らない

	void main(void) {
		//makeShadow

//		highp vec4 mvmit = normalize(uModelViewMatrix[0].xyzw);

		highp vec3 nn = normalize(((uModelViewMatrixInversedTransposed * vec4(0.0,0.0,-1.0,1.0))).xyz);//自転と公転と宇宙船移動の後の  リングの法線
		highp vec3 pos0 = (uManipulatedMatrix * vec4(0.0,0.0,0.0,1.0)).xyz;//宇宙船移動後の原点の位置
		highp vec3 pos1 = (uModelViewMatrix * vec4(aVertexPosition,1.0)).xyz;//自転と公転と宇宙船移動の後の  対象の点
		highp vec3 pos3 = (uModelViewMatrix * vec4(0.0,0.0,0.0,1.0)).xyz;//自転と公転と宇宙船移動の後の  リングの中心

		//リング平面の法線の方向を光源側にする
		highp float ganma = dot(nn,pos3-pos0);
		if(ganma<0.0)nn=-nn;

		//移動させる点pos1がリング平面の、光源側なのか、その反対側なのかを判定する
		highp float alpha = dot(nn,pos3-pos0)/max(dot(nn,pos1-pos0),0.0000001);
		highp vec3 pos2;
		highp float beta;
		highp float eta = dot(pos1-pos3,pos0-pos3);
		if(abs(alpha)>1.0){
			pos2 = alpha * pos1 + (1.0 - alpha) * pos0;
		}else{
			beta = dot(nn,pos3-pos1);
			pos2 = 0.99 * beta * nn + pos1;
		}
		gl_Position = uPerspectiveMatrix * vec4(pos2,1.0);

			vTextureCoord = aTextureCoord;
		
	}
*/});

fs = fs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");
fs = fs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");

var aAttribs = [
	"aVertexPosition",
	"aTextureCoord"
];

var aUniforms = [
	"uSampler",
	"uModelViewMatrixInversedTransposed",
	"uModelViewMatrix",
	"uPerspectiveMatrix",
	"uManipulatedMatrix"
];
if('myShaders' in window){
	console.log(sNameOfShader + "---ok1---created in myShaders");
	myShaders.create(sNameOfShader,vs,fs,aAttribs,aUniforms);
}else{
	var count = 0;
	var hoge = setInterval(function(){
		if(++count > 1000){
			clearInterval(hoge);
			console.error("Can't create myShaders."+sNameOfShader);
		}
		if('myShaders' in window){
			clearInterval(hoge);
			console.log(sNameOfShader + "---ok2---created in myShaders");
			myShaders.create(sNameOfShader,vs,fs,aAttribs,aUniforms);
		}
	},1);
}


})();