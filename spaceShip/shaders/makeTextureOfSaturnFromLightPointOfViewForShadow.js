/**
 *	土星に影を描くために、光源から見た土星に影を落とすためのシェーダーです。
 *	土星本体を描くmakeTextureOfSaturnFromLightPointOfViewForSaturnに続く、土星本体に影を落とすためのシェーダーです。
 *	色のある所は不透明の黒で描きます。黒い部分は透明にして描きます。これにより、影が描かれます。
 *	FBOはmakeTextureOfSaturnFromLightPointOfViewForSaturnのものをそのまま使います。
 *	
**/

/* */(function(){
/* */	var ccc8 = 1/0xFF;
/* */	var c8 = function (a){
/* */		return a*ccc8;
/* */	};
/* */	var ccc24 = 1/0xFFFFFF;
/* */	var c24 = function (a){
/* */		return a*ccc24;
/* */	};

/* customize below */

var sNameOfShader = "makeTextureOfSaturnFromLightPointOfViewForShadow";
var sModeOfFBO = "CNDNSN";//C[NTR]D[NTR]S[NTR]//今回は使いません
var colorBufferModeOfFBO = myFBOs.colorBufferModeIsRGBA5551;//none , colorBufferModeIsRGBA4444 , colorBufferModeIsRGBA5551 or colorBufferModeIsALPHA
var controllBlendColorDepthStencilOfFBO = function(gl){ };//使わない

var fs = (function(){/*


	uniform lowp float uBrightness;//Saturn2---1.0 ring--arbitrary to send

	uniform sampler2D uSampler;

	varying highp vec2 vTextureCoord;

	void main(void) {
		highp vec4 texelColor = texture2D(uSampler,vTextureCoord);//ja version
//		highp float gg = 1.0/pow(max(dot(texelColor,texelColor),1.0),3.0);//暗いものほど透明にする
		mediump float gg = pow(max(min(dot(texelColor.rgb,texelColor.rgb),1.0),0.0001),5.0);//暗いものほど透明にする

		gl_FragColor = vec4(uBrightness)*vec4(0.0,0.0,0.0,(gg+0.5)/2.0);
//		gl_FragColor = vec4(uBrightness)*vec4(1.0,1.0,1.0,1.0);//(gg+0.5)/2.0);//for test view

	}
*/});

var vs = (function(){/*
	attribute vec3 aVertexPosition;//x y z
	attribute vec2 aTextureCoord;//x y


	varying highp vec2 vTextureCoord;
	varying highp vec3 vNTimesEachRGB;

	uniform mat4 uNotManipulatedMatrix;
	uniform mat4 uPerspectiveMatrixForShadow;
	uniform mat4 uPerspectiveMatrix;// for test view
	uniform mat4 uQMatrix;



	void main(void) {

		gl_Position = uPerspectiveMatrixForShadow * uQMatrix * uNotManipulatedMatrix * vec4(aVertexPosition,1.0);
//		gl_Position = uPerspectiveMatrix          * uQMatrix * uNotManipulatedMatrix * vec4(aVertexPosition,1.0);//for test view


		vTextureCoord = aTextureCoord;



	}
*/});
var aAttribs = [
		"aVertexPosition",
		"aTextureCoord"
];
var aUniforms = [
		"uSampler",
		"uBrightness",
		"uNotManipulatedMatrix",
		"uPerspectiveMatrixForShadow",
		"uQMatrix",
		"uPerspectiveMatrix"//テスト用
];
/* */vs = vs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");
/* */fs = fs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");
/* */var funcShader = function(){
/* */	myShaders.create(sNameOfShader,vs,fs,aAttribs,aUniforms);
/* */};
/* */if('myShaders' in window){
/* */	console.log(sNameOfShader + "---ok1---created in myShaders");
/* */	funcShader();
/* */}else{
/* */	var count = 0;
/* */	var hoge = setInterval(function(){
/* */		if(++count > 1000){
/* */			clearInterval(hoge);
/* */			console.error("Can't create myShaders."+sNameOfShader);
/* */		}
/* */		if('myShaders' in window){
/* */			clearInterval(hoge);
/* */			console.log(sNameOfShader + "---ok2---created in myShaders");
/* */			funcShader();
/* */		}
/* */	},1);
/* */}
/* */var funcFBO = function(){
/* */	myFBOs.create(sNameOfShader,sModeOfFBO,colorBufferModeOfFBO,controllBlendColorDepthStencilOfFBO);//null---Color buffer is not to use.
/* */};
/* */if('myFBOs' in window){
/* */	console.log(sNameOfShader + "---ok1---created in myShaders");
/* */	funcFBO();
/* */}else{
/* */	var count = 0;
/* */	var hoge = setInterval(function(){
/* */		if(++count > 1000){
/* */			clearInterval(hoge);
/* */			console.error("Can't create myShaders."+sNameOfShader);
/* */		}
/* */		if('myShaders' in window){
/* */			clearInterval(hoge);
/* */			console.log(sNameOfShader + "---ok2---created in myShaders");
/* */			funcFBO();
/* */		}
/* */	},1);
/* */}
/* */
/* */})();

