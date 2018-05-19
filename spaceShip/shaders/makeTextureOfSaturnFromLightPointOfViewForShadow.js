/**
 *	�y���ɉe��`�����߂ɁA�������猩���y���ɉe�𗎂Ƃ����߂̃V�F�[�_�[�ł��B
 *	�y���{�̂�`��makeTextureOfSaturnFromLightPointOfViewForSaturn�ɑ����A�y���{�̂ɉe�𗎂Ƃ����߂̃V�F�[�_�[�ł��B
 *	�F�̂��鏊�͕s�����̍��ŕ`���܂��B���������͓����ɂ��ĕ`���܂��B����ɂ��A�e���`����܂��B
 *	FBO��makeTextureOfSaturnFromLightPointOfViewForSaturn�̂��̂����̂܂܎g���܂��B
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
var sModeOfFBO = "CNDNSN";//C[NTR]D[NTR]S[NTR]//����͎g���܂���
var colorBufferModeOfFBO = myFBOs.colorBufferModeIsRGBA5551;//none , colorBufferModeIsRGBA4444 , colorBufferModeIsRGBA5551 or colorBufferModeIsALPHA
var controllBlendColorDepthStencilOfFBO = function(gl){ };//�g��Ȃ�

var fs = (function(){/*


	uniform lowp float uBrightness;//Saturn2---1.0 ring--arbitrary to send
	uniform lowp float uAlpha;//Saturn2---1.0 ring---1.0 to send
	uniform lowp float uCassiniFactor;//Saturn2---0.0 ring---1.0 to send

	uniform sampler2D uSampler;

	varying highp vec2 vTextureCoord;

	void main(void) {
		highp vec4 texelColor = texture2D(uSampler,vTextureCoord);//ja version
//		highp float gg = 1.0/pow(max(dot(texelColor,texelColor),1.0),3.0);//�Â����̂قǓ����ɂ���
		mediump float gg = pow(max(min(dot(texelColor.rgb,texelColor.rgb),1.0),0.0001),3.0);//�Â����̂قǓ����ɂ���

		gl_FragColor = vec4(uBrightness)*vec4(0.0,0.0,0.0,(gg+0.5)/2.0);

	}
*/});

var vs = (function(){/*
	attribute vec3 aVertexPosition;//x y z
	attribute vec2 aTextureCoord;//x y


	varying highp vec2 vTextureCoord;
	varying highp vec3 vNTimesEachRGB;

	uniform mat4 uPerspectiveForShadowMatrix;
	uniform mat4 uNotManipulatedMatrix;



	void main(void) {

		//���s����
		//�����Ȃ畽�s����positionVectorSaturn�ł������ǁA�߂��Ȃ�Ɠ_�����̉e�����ł��B�Ⴆ�΁A�������Ƃ炵�Ă���d���̂����߂��Ɏ���������ƁA�傫�ȉe���ł���Ƃ������ƁB���s�����ł͉e�̑傫���͈��B
		highp vec3 positionVectorSaturn = normalize((uNotManipulatedMatrix * vec4(0.0,0.0,0.0,1.0) - vec4(0.0,0.0,0.0,1.0)).xyz);//���_���猩���y���̕����x�N�g��means PosSaturn - PosMovedOrigin

		//�_����
//		highp vec3 positionVectorSaturn = normalize((uNotManipulatedMatrix * vec4(aVertexPosition,1.0) - vec4(0.0,0.0,0.0,1.0)).xyz);//���_���猩���y���̕����x�N�g��means PosSaturn - PosMovedOrigin

		//������positionVectorSaturn��orthographicMatrix���g���ĕ��s�������猩�����̂�gl_Possition�����߁A����gl_Color�����߁AshadowFactor���Z�b�g�����̂��AperspectiveMatrix���g���ĐV����gl_Position��ݒ肵�Ȃ����Agl_Color��ݒ肷��B
		//�e�́A�F�͍��Aalpha��   �ω��Ȃ�  �ł�����ˁB


		highp vec3 centerVector = normalize(cross(positionVectorSaturn,vec3(0.0,0.0,-1.0)));//������y���Ɍ����� It make observer's gaze to be in direction to the Saturn.
		highp float theta = acos(dot(positionVectorSaturn,vec3(0.0,0.0,-1.0)));
//��		highp float theta = acos(dot(positionVectorSaturn,vec3(0.0,0.0,1.0)));
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
		//mat4 rotateLightDirection= mat4(a11,a12,a13,a14,a21,a22,a23,a24,a31,a32,a33,a34,a41,a42,a43,a44);//���Ɠ���
		//mat4 rotateLightDirection= mat4(a11,a21,a31,a41,a12,a22,a32,a42,a13,a23,a33,a43,a14,a24,a34,a44);//���̓]�u

//		gl_Position = uOrthographicMatrix * rotateLightDirection * uNotManipulatedMatrix * vec4(aVertexPosition,1.0);
		gl_Position = uPerspectiveForShadowMatrix * rotateLightDirection * uNotManipulatedMatrix * vec4(aVertexPosition,1.0);


		vTextureCoord = aTextureCoord;


//�傫������

	}
*/});
var aAttribs = [
		"aVertexPosition",
		"aTextureCoord"
];
var aUniforms = [
		"uSampler",
		"uBrightness",
		"uAlpha",
		"uCassiniFactor",
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

