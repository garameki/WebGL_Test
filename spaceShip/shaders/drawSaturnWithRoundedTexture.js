/**
 *	円形テクスチャを用いて土星を描きます。円形テクスチャにはリングの影が書き込まれています。
 *	To draw the Saturn with its rounded texture which is drawn with the shadow of the Saturn and more!
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

var sNameOfShader = "drawSaturnWithRoundedTexture";
var sModeOfFBO = "CNDNSN";//C[NTR]D[NTR]S[NTR]//画面に描きます
var colorBufferModeOfFBO = myFBOs.colorBufferModeIsRGBA4444;//none , colorBufferModeIsRGBA4444 , colorBufferModeIsRGBA5551 or colorBufferModeIsALPHA
var controllBlendColorDepthStencilOfFBO = function(gl){
	/* ここにはgl.colorMask,gl.enable/disable(gl.DEPTH_TEST),gl.enable/disable(gl.STENCIL_TEST)を書かないでください。.activate()の中で定義済みです。 */

	/** BLENDER **/
	gl.disable(gl.BLEND);
	//gl.enable(gl.BLEND);

	/** COLOR **/
	gl.colorMask(true,true,true,true);
	gl.clearColor(c8(0x00),c8(0x00),c8(0x00),c8(0x00));
	gl.clear(gl.COLOR_BUFFER_BIT);

	/** DEPTH **/
	gl.enable(gl.DEPTH_TEST);
	gl.clearDepth(c24(0xFFFFFF));
	gl.clear(gl.DEPTH_BUFFER_BIT);
	gl.depthFunc(gl.LEQUAL);

	/** STENCIL **/
	//ダメgl.disable(gl.STENCIL_TEST);

};


var fs = (function(){/*

//hint
//	varying lowp vec3 vNTimesEachRGB;//as same as vertex shader
	varying highp vec3 vNTimesEachRGB;//as same as vertex shader

	varying lowp vec2 vTextureCoordRectangle;
	varying lowp vec2 vTextureCoordRounded;
	varying lowp float vZZ;
	varying lowp vec4 vPosition;

	uniform mediump float uBrightness;
	uniform mediump float uAlpha;
	uniform mediump float uCassiniFactor;//if zero , not avairable,,if 1 , avairable
	uniform sampler2D uSamplerRectangle;
	uniform sampler2D uSamplerRounded;

	mediump float norm(vec2 vv){
		return sqrt(vv.x * vv.x + vv.y * vv.y);
	}
	void main(void) {
		highp vec4 texelColor;
//		if(vZZ < -1.0){
//			texelColor = texture2D(uSamplerRectangle,vTextureCoordRectangle);//ja version
//		}else{
			
			texelColor = texture2D(uSamplerRounded,vTextureCoordRounded);
//		}
			highp float gg = 1.0/pow(max(dot(texelColor,texelColor),1.0),3.0);//暗いものほど透明にする-->いつもどうりに描く。テクスチャが変わっただけなので。
		//	gl_FragColor = vec4(uBrightness)*vec4(texelColor.rgb * vNTimesEachRGB,(1.0-gg*uCassiniFactor)*uAlpha*texelColor.a);
		//	gl_FragColor = vec4(uBrightness)*vec4(texelColor.rgb * vNTimesEachRGB,(1.0-gg*0.0)*uAlpha);
			gl_FragColor = vec4(uBrightness)*vec4(texelColor.rgb * vNTimesEachRGB,1.0);
		//	gl_FragColor = vec4(uBrightness)*vec4(texelColor.rgb,1.0);
			


		//	gl_FragColor = vPosition;//座標がわかる良い方法
	}
*/});

var vs = (function(){/*
	//'attribute' this type is used in vertex shader only.This type is assigned on buffers defined in js
	attribute vec3 aVertexPosition;//x y z
	attribute vec3 aVertexNormal;//x y z
	attribute vec4 aVertexColor;//R G B Alpha
	attribute vec2 aTextureCoord;//x y

	//The type of 'uniform' mainly matrices receipter from js
	uniform mat4 uModelViewMatrixInversedTransposed;
	uniform mat4 uModelViewMatrix;
	uniform mat4 uPerspectiveMatrix;
	uniform mat4 uManipulatedRotationMatrix;


//●
	uniform mat4 uManipulatedMatrix;


	uniform float uBaseLight;// 0.0-1.0 ?
	uniform float uPointSizeFloat;//a float value

	uniform mat4 uNotManipulatedMatrix;
	uniform float uRadiusOfSaturn;
	uniform mat4 uPerspectiveForShadowMatrix;

	varying lowp vec3 vNTimesEachRGB;
	
	varying lowp vec2 vTextureCoordRectangle;
	varying lowp vec2 vTextureCoordRounded;
	varying lowp float vZZ;
	varying lowp vec4 vPosition;

	void main(void) {
//		vTextureCoord = aTextureCoord;

		//分ける　位置ベクトル　と　方向ベクトル
		//位置ベクトル....移動できる　回転できる
		//方向ベクトル....回転できる

	//point lighting
		//prepare Normal
		vec4 transformedNormal = uModelViewMatrixInversedTransposed * vec4(aVertexNormal,1.0);
		
//原点の移動後の位置を引く必要がある-->移動(by manipulation)する前の位置が、その位置
		//prepare light vectorg
		vec4 directional = -vec4(1.5) * normalize(uModelViewMatrix * vec4(aVertexPosition,1.0) - uManipulatedMatrix * vec4(0.0,0.0,0.0,1.0));//自分の中を照らしてるだけ
		

		//intensity of surface
		float quantity = max(dot(normalize(transformedNormal.xyz),directional.xyz),uBaseLight);//scalar quantity as the light intensity

		vec3 directionalLightColor = vec3(1,1,1);//RGB intensity

		//ambient light
		vec3 ambientLight = vec3(0.1,0.1,0.1);//This is not the direction but the intensity of color.It does not have relationship with Normal Vector in vertex data.It relates with only 'gl_Color'.

		vNTimesEachRGB = ambientLight + (directionalLightColor * quantity);


	//テクスチャを描いた時と同じポジションに持っていく

		highp vec3 positionVectorSaturn = normalize((uNotManipulatedMatrix * vec4(0.0,0.0,0.0,1.0) - vec4(0.0,0.0,0.0,1.0)).xyz);//原点から見た土星の方向ベクトルmeans PosSaturn - PosMovedOrigin
		highp vec3 centerVector = normalize(cross(positionVectorSaturn,vec3(0.0,0.0,-1.0)));//視線を土星に向ける It make observer's gaze to be in direction to the Saturn.
		highp float theta = acos(dot(positionVectorSaturn,vec3(0.0,0.0,-1.0)));
		//quaternion
		highp float ncos = cos(-theta*0.5);
		highp float nsin = sin(-theta*0.5);

		highp float q0=ncos;
		highp float q1=centerVector.x*nsin;
		highp float q2=centerVector.y*nsin;
		highp float q3=centerVector.z*nsin;


		highp float qq0 = q0*q0;
		highp float qq1 = q1*q1;
		highp float qq2 = q2*q2;
		highp float qq3 = q3*q3;

		highp float qq12 = q1*q2*2.0;
		highp float qq03 = q0*q3*2.0;
		highp float qq13 = q1*q3*2.0;
		highp float qq02 = q0*q2*2.0;
		highp float qq23 = q2*q3*2.0;
		highp float qq01 = q0*q1*2.0;

		highp mat4 rotateLightDirection= mat4(qq0+qq1-qq2-qq3,qq12-qq03,qq13+qq02,0,qq12+qq03,qq0-qq1+qq2-qq3,qq23-qq01,0,qq13-qq02,qq23+qq01,qq0-qq1-qq2+qq3,0,0,0,0,1);

		//highp float a11=qq0+qq1-qq2-qq3;highp float a12=qq12-qq03;highp float a13=qq13+qq02;highp float a14=0.0;highp float a21=qq12+qq03;highp float a22=qq0-qq1+qq2-qq3;highp float a23=qq23-qq01;highp float a24=0.0;highp float a31=qq13-qq02;highp float a32=qq23+qq01;highp float a33=qq0-qq1-qq2+qq3;highp float a34=0.0;highp float a41=0.0;highp float a42=0.0;highp float a43=0.0;highp float a44=1.0;
		//mat4 rotateLightDirection= mat4(a11,a12,a13,a14,a21,a22,a23,a24,a31,a32,a33,a34,a41,a42,a43,a44);//元と同じ
		//mat4 rotateLightDirection= mat4(a11,a21,a31,a41,a12,a22,a32,a42,a13,a23,a33,a43,a14,a24,a34,a44);//元の転置

		vec4 xyzw = uPerspectiveForShadowMatrix * rotateLightDirection * uNotManipulatedMatrix * vec4(aVertexPosition,1.0);
		vTextureCoordRectangle = aTextureCoord;
		vTextureCoordRounded   = 0.5 + 0.5 * (xyzw.xy / xyzw.w);
		vZZ = xyzw.z / xyzw.w;	
		vPosition = vec4(0.0,0.0,(xyzw.z / xyzw.w)-0.5,1.0);//xyzw.z == xyzw.w
		//gl_Position = xyzw;//vec4((uPerspectiveForShadowMatrix * rotateLightDirection * uNotManipulatedMatrix * vec4(aVertexPosition,1.0)).xy,-0.0,5.0);//zw;

		gl_Position = uPerspectiveMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);
		gl_PointSize = uPointSizeFloat;

// ************************************************************************************************************************************************

	}
*/});

var aAttribs = [
		"aVertexPosition",
		"aVertexNormal",
		"aVertexColor",
		"aTextureCoord"
];
var aUniforms = [
		"uPerspectiveMatrix",
		"uModelViewMatrix",
		"uPointSizeFloat",
		"uSamplerRounded",//影の入った丸いテクスチャ
		"uSamplerRectangle",//通常のテクスチャ
		"uModelViewMatrixInversedTransposed",
		"uBaseLight",
//		"uManipulatedRotationMatrix",
		"uBrightness",
		"uAlpha",
		"uCassiniFactor",
		"uManipulatedMatrix",
		"uRadiusOfSaturn",
		"uNotManipulatedMatrix",
		"uPerspectiveForShadowMatrix"
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
