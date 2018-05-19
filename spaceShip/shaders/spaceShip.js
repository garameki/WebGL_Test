/**
 *	�f�v�X�o�b�t�@��␳���āA�J���[�Ƃ��ĕ\�����܂��B
 *	To draw the texture of depth buffer as the texture of color buffer
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

var sNameOfShader = "spaceShip";
var sModeOfFBO = "CTDTSN";//C[NTR]D[NTR]S[NTR]
var colorBufferModeOfFBO = myFBOs.colorBufferModeIsRGBA4444;//none , colorBufferModeIsRGBA4444 , colorBufferModeIsRGBA5551 or colorBufferModeIsALPHA
var controllBlendColorDepthStencilOfFBO = function(gl){
	/* �����ɂ�gl.colorMask,gl.enable/disable(gl.DEPTH_TEST),gl.enable/disable(gl.STENCIL_TEST)�������Ȃ��ł��������B.activate()�̒��Œ�`�ς݂ł��B */

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
	//�_��gl.disable(gl.STENCIL_TEST);

};


var fs = (function(){/*

//hint
//	varying lowp vec4 vColor;	//as same as vertex shader
//	varying lowp vec2 vTextureCoord;//as same as vertex shader
//	varying lowp vec3 vNTimesEachRGB;//as same as vertex shader
	varying highp vec4 vColor;//��	//as same as vertex shader
	varying highp vec2 vTextureCoord;//as same as vertex shader
	varying highp vec3 vNTimesEachRGB;//as same as vertex shader

	uniform mediump float uBrightness;
	uniform mediump float uAlpha;
	uniform mediump float uCassiniFactor;//if zero , not avairable,,if 1 , avairable
	uniform sampler2D uSampler;//common variable between shader and js

	void main(void) {

	//  method 1 
//		gl_FragColor = texture2D(uSampler,vTextureCoord);//�F���⊮����Ċۂ�������Ȃ�ׂ�����ɂ�����

	//  method 2 
//		gl_FragColor = vColor;

		//uSampler�̐�����gl.TEXT0�̐����͋���

	 // method 3 
	//	mediump vec4 texelColor = texture2D(uSampler,vTextureCoord);//ja version
	//	mediump float gg = 1.0/pow(max(dot(texelColor,texelColor),1.0),3.0);//�Â����̂قǓ����ɂ���
	//	mediump float shadowFlag =1.0;
	//	gl_FragColor = vec4(shadowFlag) * vec4(uBrightness)*vec4(texelColor.rgb * vNTimesEachRGB,(1.0-gg*uCassiniFactor)*uAlpha*texelColor.a);

	 // method 4 
		highp vec4 texelColor = texture2D(uSampler,vTextureCoord);//ja version
		highp float gg = 1.0/pow(max(dot(texelColor,texelColor),1.0),3.0);//�Â����̂قǓ����ɂ���
		gl_FragColor = vec4(uBrightness)*vec4(texelColor.rgb * vNTimesEachRGB,(1.0-gg*uCassiniFactor)*uAlpha*texelColor.a);
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


//��
	uniform mat4 uManipulatedMatrix;


	uniform float uBaseLight;// 0.0-1.0 ?
	uniform float uPointSizeFloat;//a float value

//hint
//	varying lowp vec4 vColor;
//	varying lowp vec2 vTextureCoord;
//	varying lowp vec3 vNTimesEachRGB;
	varying lowp vec4 vColor;
	varying lowp vec2 vTextureCoord;
	varying lowp vec3 vNTimesEachRGB;


	void main(void) {
//��kkk
		gl_Position = uPerspectiveMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);

		gl_PointSize = uPointSizeFloat;
		vColor = aVertexColor;
		vTextureCoord = aTextureCoord;

		//������@�ʒu�x�N�g���@�Ɓ@�����x�N�g��
		//�ʒu�x�N�g��....�ړ��ł���@��]�ł���
		//�����x�N�g��....��]�ł���

//		// How to simulate 1 directional and ambient light
//		// prepare Normal
//		vec4 transformedNormal = uModelViewMatrixInversedTransposed * vec4(aVertexNormal,1.0);
//		//prepare Light 1
//		vec3 directional = normalize(vec3(0.0,0.0,1.0));
//		vec3 directionalNew = vec3(2.0) * normalize(uManipulatedRotationMatrix * vec4(directional,1.0)).xyz;//(intension of light)*2//a new position of the light
//		//calculation intensity of lit surface
//		float quantity = max(dot(transformedNormal.xyz,directionalNew),uBaseLight);//scalar quantity as the light intensity
//		//set color of light
//		vec3 directionalLightColor = vec3(1,1,1);
//		//set color of ambient light
//		vec3 ambientLight = vec3(0.1,0.1,0.1);//This is not the direction but the intensity of color.It does not have relationship with Normal Vector in vertex data.It relates with only 'gl_Color'.
//		//calc total
//		vNTimesEachRGB = ambientLight + (directionalLightColor * quantity);
//	// a effect    please go inside of planets
//		vec4 transformedNormal = uModelViewMatrixInversedTransposed * vec4(aVertexNormal,1.0);
//		vec4 directional = uModelViewMatrixInversedTransposed * vec4(aVertexPosition,1.0);
//		directional = directional / directional.w;
//		float quantity = max(dot(normalize(transformedNormal.xyz),directional.xyz),uBaseLight);//scalar quantity as the light intensity
//		vec3 directionalLightColor = vec3(1,1,1);//RGB intensity
//		vec3 ambientLight = vec3(0.1,0.1,0.1);//This is not the direction but the intensity of color.It does not have relationship with Normal Vector in vertex data.It relates with only 'gl_Color'.
//		vNTimesEachRGB = ambientLight + (directionalLightColor * quantity);
	//point lighting
		//prepare Normal
		vec4 transformedNormal = uModelViewMatrixInversedTransposed * vec4(aVertexNormal,1.0);
		
//���_�̈ړ���̈ʒu�������K�v������-->�ړ�(by manipulation)����O�̈ʒu���A���̈ʒu
		//prepare light vectorg
//		vec4 directional = uModelViewMatrixInversedTransposed * vec4(aVertexPosition,1.0);
//		directional = directional / directional.w;
		vec4 directional = -vec4(1.5) * normalize(uModelViewMatrix * vec4(aVertexPosition,1.0) - uManipulatedMatrix * vec4(0.0,0.0,0.0,1.0));//�����̒����Ƃ炵�Ă邾��
//		vec4 directional = normalize(uModelViewMatrix * vec4(aVertexPosition,1.0) - uModelViewMatrix * vec4(0.0,0.0,0.0,1.0));//�����O�����邢
//�Ώۓ_�̈ړ��s�� * �Ώۓ_�̌��̈ʒu�x�N�g�� - ���_�̈ړ��ɂ��������s�� * ���_�̌��̈ʒu�x�N�g��
//		vec4 directional = normalize(uModelViewMatrix * vec4(aVertexPosition,0.0));//���s�ړ��̌��ʂ𖳂���// = normalize(uModelViewMatrix * vec4(aVertexPosition,1.0) - uModelViewMatrix * vec4(0.0,0.0,0.0,1.0));
//		vec4 directional = normalize(vec4(0.0,0.0,1.0,1.0));
//		vec directional = vec3(2.0) * normalize(uManipulatedRotationMatrix * vec4(directional,1.0)).xyz;//(intension of light)*2//a new position of the light
//		vec directional = vec3(2.0) * normalize(uModelViewMatrix * vec4(directional,1.0)).xyz;//(intension of light)*2//a new position of the light
//		vec directional = normalize(uManipulatedRotationMatrix * vec4(directional,1.0)).xyz;//brightness*2//a new position of the light
		

		//intensity of surface
		float quantity = max(dot(normalize(transformedNormal.xyz),directional.xyz),uBaseLight);//scalar quantity as the light intensity

		vec3 directionalLightColor = vec3(1,1,1);//RGB intensity

		//ambient light
		vec3 ambientLight = vec3(0.1,0.1,0.1);//This is not the direction but the intensity of color.It does not have relationship with Normal Vector in vertex data.It relates with only 'gl_Color'.

		vNTimesEachRGB = ambientLight + (directionalLightColor * quantity);

//		gl_Position = uPerspectiveMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);

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
		"uSampler",
		"uModelViewMatrixInversedTransposed",
		"uBaseLight",
//		"uManipulatedRotationMatrix",
		"uBrightness",
		"uAlpha",
		"uCassiniFactor",
		"uManipulatedMatrix"
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