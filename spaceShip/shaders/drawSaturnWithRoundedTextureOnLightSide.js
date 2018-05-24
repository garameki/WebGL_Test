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

var sNameOfShader = "drawSaturnWithRoundedTextureOnLightSide";
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

	uniform mediump float uBrightness;
	uniform sampler2D uSamplerRounded;

	varying mediump vec3 vNTimesEachRGB;//as same as vertex shader
	varying highp vec2 vTextureCoordRounded;

	void main(void) {
		highp vec4 texelColor = texture2D(uSamplerRounded,vTextureCoordRounded);
		gl_FragColor = vec4(uBrightness) * vec4(texelColor.rgb * vNTimesEachRGB,1.0);

		//���W��F�����Ō��₷���ł���ǂ����@
		//gl_FragColor = vec4(1.0);//vec4(vPosition.rgb * vNTimesEachRGB,1.0);
	}
*/});

var vs = (function(){/*
	//'attribute' this type is used in vertex shader only.This type is assigned on buffers defined in js
	attribute vec3 aVertexPosition;//x y z
	attribute vec3 aVertexNormal;//x y z

	//The type of 'uniform' mainly matrices receipter from js
	uniform mat4 uModelViewMatrixInversedTransposed;
	uniform mat4 uModelViewMatrix;
	uniform mat4 uPerspectiveMatrix;
	uniform mat4 uManipulatedMatrix;
	uniform mat4 uPerspectiveMatrixForShadow;
	uniform mat4 uNotManipulatedMatrix;


	uniform float uBaseLight;// 0.0-1.0 ?
	uniform float uRadiusOfSaturn;

	varying mediump vec3 vNTimesEachRGB;//as same as vertex shader
	varying highp vec2 vTextureCoordRounded;

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
		float lenLO = funcLength(pO - pL);
		float beta = asin(uRadiusOfSaturn / lenLO);
		vec3 pC = lenLO * cos(beta) * cos(beta) * vLN + pL;
		//���ʏ�̓_�̈ʒu
		vec3 pQ = dot(vLN,pC-pP) * vLN + pP;
		//���ʂ��u�ĂāA������(LP < LQ)���e��(LP > LQ)���𔻒f����
		float lLQ = funcLength(pQ - pL);
		float lLP = funcLength(pP - pL);
		vec3 pos;
		pos = lLP >= lLQ ? pQ : pP;

		gl_Position = uPerspectiveMatrix * vec4(pos,1.0);

	//�e�N�X�`���̈ʒu���v�Z

//�e�N�X�`�����쐬���Ă���̂Ɠ������W���g���Ă���̂ɂ�������炸�A�����������Ђ�Ђ炷��̂́A�e�N�X�`����s,t�̎w����@���Ԉ���Ă���Ƃ������ƁB



		//���s����
		//�����Ȃ畽�s����positionVectorSaturn�ł������ǁA�߂��Ȃ�Ɠ_�����̉e�����ł��B�Ⴆ�΁A�������Ƃ炵�Ă���d���̂����߂��Ɏ���������ƁA�傫�ȉe���ł���Ƃ������ƁB���s�����ł͉e�̑傫���͈��B
		vec3 positionVectorSaturn = normalize((uNotManipulatedMatrix * vec4(0.0,0.0,0.0,1.0) - vec4(0.0,0.0,0.0,1.0)).xyz);//���_���猩���y���̕����x�N�g��means PosSaturn - PosMovedOrigin

		//�_����
//		vec3 positionVectorSaturn = normalize((uNotManipulatedMatrix * vec4(aVertexPosition,1.0) - vec4(0.0,0.0,0.0,1.0)).xyz);//���_���猩���y���̕����x�N�g��means PosSaturn - PosMovedOrigin

		//������positionVectorSaturn��orthographicMatrix���g���ĕ��s�������猩�����̂�gl_Possition�����߁A����gl_Color�����߁AshadowFactor���Z�b�g�����̂��AperspectiveMatrix���g���ĐV����gl_Position��ݒ肵�Ȃ����Agl_Color��ݒ肷��B
		//�e�́A�F�͍��Aalpha��   �ω��Ȃ�  �ł�����ˁB


		vec3 centerVector = normalize(cross(positionVectorSaturn,vec3(0.0,0.0,-1.0)));//������y���Ɍ����� It make observer's gaze to be in direction to the Saturn.
		float theta = acos(dot(positionVectorSaturn,vec3(0.0,0.0,-1.0)));
//��		float theta = acos(dot(positionVectorSaturn,vec3(0.0,0.0,1.0)));
		//quaternion
		float ncos = cos(-theta*0.5);
		float nsin = sin(-theta*0.5);

		float q0=ncos;
		float q1=centerVector.x*nsin;
		float q2=centerVector.y*nsin;
		float q3=centerVector.z*nsin;


		float qq0 = q0*q0;
		float qq1 = q1*q1;
		float qq2 = q2*q2;
		float qq3 = q3*q3;

		float qq12 = q1*q2*2.0;
		float qq03 = q0*q3*2.0;
		float qq13 = q1*q3*2.0;
		float qq02 = q0*q2*2.0;
		float qq23 = q2*q3*2.0;
		float qq01 = q0*q1*2.0;

		mat4 rotateLightDirection= mat4(qq0+qq1-qq2-qq3,qq12-qq03,qq13+qq02,0,qq12+qq03,qq0-qq1+qq2-qq3,qq23-qq01,0,qq13-qq02,qq23+qq01,qq0-qq1-qq2+qq3,0,0,0,0,1);

		//float a11=qq0+qq1-qq2-qq3;float a12=qq12-qq03;float a13=qq13+qq02;float a14=0.0;float a21=qq12+qq03;float a22=qq0-qq1+qq2-qq3;float a23=qq23-qq01;float a24=0.0;float a31=qq13-qq02;float a32=qq23+qq01;float a33=qq0-qq1-qq2+qq3;float a34=0.0;float a41=0.0;float a42=0.0;float a43=0.0;float a44=1.0;
		//mat4 rotateLightDirection= mat4(a11,a12,a13,a14,a21,a22,a23,a24,a31,a32,a33,a34,a41,a42,a43,a44);//���Ɠ���
		//mat4 rotateLightDirection= mat4(a11,a21,a31,a41,a12,a22,a32,a42,a13,a23,a33,a43,a14,a24,a34,a44);//���̓]�u

		vec4 xyzw = uPerspectiveMatrixForShadow * rotateLightDirection * uNotManipulatedMatrix * vec4(aVertexPosition,1.0);

		xyzw = vec4(xyzw.xy*0.996,xyzw.zw);
//��		xyzw = vec4(xyzw.xy*1.0,xyzw.zw);
		vTextureCoordRounded = (xyzw.xy / xyzw.w) * 0.5 + 0.5;



//		vec3 positionVectorSaturn = normalize((uNotManipulatedMatrix * vec4(0.0,0.0,0.0,1.0) - vec4(0.0,0.0,0.0,1.0)).xyz);//���_���猩���y���̕����x�N�g��means PosSaturn - PosMovedOrigin
//		vec3 centerVector = normalize(cross(positionVectorSaturn,vec3(0.0,0.0,-1.0)));//������y���Ɍ����� It make observer's gaze to be in direction to the Saturn.
//		float theta = acos(dot(positionVectorSaturn,vec3(0.0,0.0,-1.0)));
//		//quaternion
//		float ncos = cos(-theta*0.5);
//		float nsin = sin(-theta*0.5);

//		float q0=ncos;
//		float q1=centerVector.x*nsin;
//		float q2=centerVector.y*nsin;
//		float q3=centerVector.z*nsin;


//		float qq0 = q0*q0;
//		float qq1 = q1*q1;
//		float qq2 = q2*q2;
//		float qq3 = q3*q3;

//		float qq12 = q1*q2*2.0;
//		float qq03 = q0*q3*2.0;
//		float qq13 = q1*q3*2.0;
//		float qq02 = q0*q2*2.0;
//		float qq23 = q2*q3*2.0;
//		float qq01 = q0*q1*2.0;

//		mat4 rotateLightDirection= mat4(qq0+qq1-qq2-qq3,qq12-qq03,qq13+qq02,0,qq12+qq03,qq0-qq1+qq2-qq3,qq23-qq01,0,qq13-qq02,qq23+qq01,qq0-qq1-qq2+qq3,0,0,0,0,1);

//		//float a11=qq0+qq1-qq2-qq3;float a12=qq12-qq03;float a13=qq13+qq02;float a14=0.0;float a21=qq12+qq03;float a22=qq0-qq1+qq2-qq3;float a23=qq23-qq01;float a24=0.0;float a31=qq13-qq02;float a32=qq23+qq01;float a33=qq0-qq1-qq2+qq3;float a34=0.0;float a41=0.0;float a42=0.0;float a43=0.0;float a44=1.0;
//		//mat4 rotateLightDirection= mat4(a11,a12,a13,a14,a21,a22,a23,a24,a31,a32,a33,a34,a41,a42,a43,a44);//���Ɠ���
//		//mat4 rotateLightDirection= mat4(a11,a21,a31,a41,a12,a22,a32,a42,a13,a23,a33,a43,a14,a24,a34,a44);//���̓]�u

//		mediump vec4 xyzw = uPerspectiveMatrixForShadow * rotateLightDirection * uNotManipulatedMatrix * vec4(aVertexPosition,1.0);
//		vTextureCoordRounded = (xyzw.xy / xyzw.w) * 0.5 + 0.5;

	}
*/});

// ************************************************************************************************************************************************

var aAttribs = [
	"aVertexPosition",
	"aVertexNormal"
];
var aUniforms = [
	"uModelViewMatrixInversedTransposed",
	"uModelViewMatrix",
	"uPerspectiveMatrix",
	"uManipulatedMatrix",
	"uBaseLight",
	"uNotManipulatedMatrix",
	"uPerspectiveMatrixForShadow",
	"uBrightness",
	"uSamplerRounded",
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
