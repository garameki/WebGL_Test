/**
 *	�l�p���ʏ�̃e�N�X�`����p���ēy���̉e�̕����̖͗l��`���܂��B
 *	To draw the surface not lit on the Saturn with its ordinary rectangle texture.
 *	The difference from common shader is that the part of the shape lit is folded forward to its center.
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

var sNameOfShader = "drawSaturnWithRectangleTextureOnDarkSide";
var sModeOfFBO = "CNDNSN";//C[NTR]D[NTR]S[NTR]//��ʂɕ`���܂�
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

	varying mediump vec3 vNTimesEachRGB;//as same as vertex shader
	varying lowp vec2 vTextureCoordRectangle;
	varying lowp float vZclip;

	uniform mediump float uBrightness;
	uniform sampler2D uSamplerRectangle;

	void main(void) {
		highp vec4 texelColor;
	//	if(vZclip >= 1.0){
			texelColor = texture2D(uSamplerRectangle,vTextureCoordRectangle);
			gl_FragColor = vec4(uBrightness) * vec4(texelColor.rgb * vNTimesEachRGB,1.0);
	//	}else{
	//		discard;
	//	}

	//		gl_FragColor = vec4(1.0);//vec4(vPosition.rgb * vNTimesEachRGB,1.0);//���W��F�����Ō��₷���ł���ǂ����@
	}
*/});

var vs = (function(){/*
	//'attribute' this type is used in vertex shader only.This type is assigned on buffers defined in js
	attribute vec3 aVertexPosition;//x y z
	attribute vec3 aVertexNormal;//x y z
	attribute vec2 aTextureCoord;//x y

	//The type of 'uniform' mainly matrices receipter from js
	uniform mat4 uModelViewMatrixInversedTransposed;
	uniform mat4 uModelViewMatrix;
	uniform mat4 uPerspectiveMatrix;
	uniform mat4 uManipulatedMatrix;


	uniform float uBaseLight;// 0.0-1.0 ?

	uniform float uRadiusOfSaturn;

	varying mediump vec3 vNTimesEachRGB;//as same as vertex shader
	varying lowp vec2 vTextureCoordRectangle;
	varying lowp float vZclip;

	//mat4 * vec3
	vec3 funcMult(mat4 m,vec3 v){
		return (m * vec4(v,1.0)).xyz;
	}
	//����
	float funcLength(vec3 vector){
		return sqrt(dot(vector,vector));
	}
	void main(void) {

		//������@�ʒu�x�N�g���@�Ɓ@�����x�N�g��
		//�ʒu�x�N�g��....�ړ��ł���@��]�ł���
		//�����x�N�g��....��]�ł���

	//point lighting
		//prepare Normal
		vec4 transformedNormal = uModelViewMatrixInversedTransposed * vec4(aVertexNormal,1.0);
		
//���_�̈ړ���̈ʒu�������K�v������-->�ړ�(by manipulation)����O�̈ʒu���A���̈ʒu
		//prepare light vectorg
		vec4 directional = -vec4(1.5) * normalize(uModelViewMatrix * vec4(aVertexPosition,1.0) - uManipulatedMatrix * vec4(0.0,0.0,0.0,1.0));//�����̒����Ƃ炵�Ă邾��

		//intensity of surface
		float quantity = max(dot(normalize(transformedNormal.xyz),directional.xyz),uBaseLight);//scalar quantity as the light intensity

		vec3 directionalLightColor = vec3(1,1,1);//RGB intensity

		//ambient light
		vec3 ambientLight = vec3(0.1,0.1,0.1);//This is not the direction but the intensity of color.It does not have relationship with Normal Vector in vertex data.It relates with only 'gl_Color'.

		vNTimesEachRGB = ambientLight + (directionalLightColor * quantity);


	//���̓������Ă��镔���̓_�̍Čv�Z

		//�����̈ʒu
		vec3 pL = funcMult(uManipulatedMatrix,vec3(0.0));
		//�y���̒��S�̈ʒu o O 0
		vec3 pO = funcMult(uModelViewMatrix,vec3(0.0));
		//�ΏۂƂȂ�\�ʏ�̈ʒu
		vec3 pP = funcMult(uModelViewMatrix,aVertexPosition); 
		//��������y���̒��S�Ɍ����������P�ʃx�N�g��
		vec3 vLN = normalize(pO -pL);
		//�������猩�Č����������Ă��镔���Ɠ������Ă��Ȃ������̋��E�ʂƁA�����Ɠy���̒��S�����񂾐��́A��_
		float lLO = funcLength(pO - pL);
		float theta = asin(uRadiusOfSaturn / lLO);
		vec3 pC = lLO * cos(theta) * cos(theta) * vLN + pL;
		//���ʏ�̓_�̈ʒu
		vec3 pQ = dot(vLN,pC-pP) * vLN + pP;
		//���ʂ��u�ĂāA������(LP < LQ)���e��(LP > LQ)���𔻒f����
		float lLQ = funcLength(pQ - pL);
		float lLP = funcLength(pP - pL);
		vec3 pos;
		pos = lLP < lLQ ? pQ : pP;


		gl_Position = uPerspectiveMatrix * vec4(pos,1.0);

	//�e�N�X�`���̈ʒu���v�Z
		vTextureCoordRectangle = aTextureCoord;

	}
*/});

// ************************************************************************************************************************************************

var aAttribs = [
	"aVertexPosition",
	"aVertexNormal",
	"aTextureCoord"
];
var aUniforms = [
	"uModelViewMatrixInversedTransposed",
	"uModelViewMatrix",
	"uPerspectiveMatrix",
	"uManipulatedMatrix",
	"uBaseLight",
	"uBrightness",
	"uSamplerRectangle",
	"uRadiusOfSaturn"
];

// ************************************************************************************************************************************************

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