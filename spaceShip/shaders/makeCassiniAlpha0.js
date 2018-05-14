/*
 *	カッシーニ部分（黒色）を透明にして描画する
 *	To make black part of pixel transparent pixel to draw
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

var sNameOfShader = "makeCassiniAlpha0";
var sModeOfFBO = "CTDTSN";//C[NTR]D[NTR]S[NTR]
var colorBufferModeOfFBO = myFBOs.colorBufferModeIsALPHA;//none , colorBufferModeIsRGBA4444 , colorBufferModeIsRGBA5551 or colorBufferModeIsALPHA
var controllColorDepthStencilOfFBO = function(gl){

	/* ここにはgl.colorMask,gl.enable/disable(gl.DEPTH_TEST),gl.enable/disable(gl.STENCIL_TEST)を書かないでください。.activate()の中で定義済みです。 */

	/** BLENDER **/
	//color(RGBA) = (sourceColor * sfactor) + (destinationColor * dfactor)
//	gl.disable(gl.BLEND);
	gl.enable(gl.BLEND);//●
	gl.blendFunc(gl.SRC_ALPHA,gl.ONE);//●

	/** COLOR **/
	//ダメgl.colorMask(true,true,true,true);
//	gl.clearColor(c8(0xFF),c8(0xFF),c8(0xFF),c8(0xFF));//●
//	gl.clear(gl.COLOR_BUFFER_BIT);//●

	/** DEPTH **/
	//ダメgl.enable(gl.DEPTH_TEST);
	//gl.clearDepth(c24(0xFFFFFF));
	//gl.clear(gl.DEPTH_BUFFER_BIT);
	//gl.depthFunc(gl.LEQUAL);

	/** STENCIL **/
	//ダメgl.disable(gl.STENCIL_TEST);
};

var fs = (function(){/*

//	varying lowp vec2 vTextureCoord;
	varying highp vec2 vTextureCoord;

	uniform sampler2D uSampler;

	void main(void) {

		mediump vec4 texelColor = texture2D(uSampler,vTextureCoord);
		mediump float gg = 1.0/pow(max(dot(texelColor,texelColor),1.0),3.0);//暗いものほど透明にする
		gl_FragColor = vec4(texelColor.rgb,(1.0-gg));//gl.blendFunc(gl.SRC_ALPHA,gl.ONE);が掛けてある

	}
*/});


var vs = (function(){/*
	attribute vec3 aVertexPosition;//x y z
	attribute vec2 aTextureCoord;//x y

	uniform mat4 uModelViewMatrix;
	uniform mat4 uPerspectiveMatrix;

//	varying lowp vec2 vTextureCoord;
	varying highp vec2 vTextureCoord;


	void main(void) {
		gl_Position = uPerspectiveMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);
		vTextureCoord = aTextureCoord;
	}
*/});

var aAttribs = ["aVertexPosition","aTextureCoord"];
var aUniforms = ["uSampler","uModelViewMatrix","uPerspectiveMatrix"];




/* */fs = fs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");
/* */vs = vs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");
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
/* */	myFBOs.create(sNameOfShader,sModeOfFBO,colorBufferModeOfFBO,controllColorDepthStencilOfFBO);//null---Color buffer is not to use.
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
/* */})();


//作成したいもの（目的）から、""なに""を必要としているのかを逆順で考えると解が得やすい

//3.Stencil Textureを作成します
//2.Alpha Textureから作成します
//1.テクスチャーの黒の部分からColor TextureのAlpha専用を作ります



