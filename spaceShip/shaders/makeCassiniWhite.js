/*
 *	�J�b�V�[�j�����i���F�j�𓧖��ɂ��ĕ`�悷��
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

var sNameOfShader = "makeCassiniWhite";
var sModeOfFBO = "CTDNSN";//C[NTR]D[NTR]S[NTR]
var colorBufferModeOfFBO = myFBOs.colorBufferModeIsRGBA4444;//none , colorBufferModeIsRGBA4444 , colorBufferModeIsRGBA5551 or colorBufferModeIsALPHA
var controllColorDepthStencilOfFBO = function(gl){
if(true){
	/* �����ɂ�gl.colorMask,gl.enable/disable(gl.DEPTH_TEST),gl.enable/disable(gl.STENCIL_TEST)�������Ȃ��ł��������B.activate()�̒��Œ�`�ς݂ł��B */

	/** BLENDER **/
	//color(RGBA) = (sourceColor * sfactor) + (destinationColor * dfactor)
	gl.enable(gl.BLEND);//��
	gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);//��

	/** COLOR **/
	gl.colorMask(true,true,true,true);
	gl.clearColor(c8(0x00),c8(0x00),c8(0x00),c8(0x00));//��
	gl.clear(gl.COLOR_BUFFER_BIT);//��

	/** DEPTH **/
//	gl.clearDepth(c24(0xFFFFFF));
//	gl.clear(gl.DEPTH_BUFFER_BIT);
//	gl.depthFunc(gl.LEQUAL);

	/** STENCIL **/
	//�_��gl.disable(gl.STENCIL_TEST);
}//boolean
};

var fs = (function(){/*

//	varying lowp vec2 vTextureCoord;
	varying highp vec2 vTextureCoord;

	uniform sampler2D uSampler;

	void main(void) {

		mediump vec4 texelColor = texture2D(uSampler,vTextureCoord);
		mediump float gg = pow(max(min(dot(texelColor.rgb,texelColor.rgb),1.0),0.0001),1.2);//�Â����̂قǓ����ɂ���
		if(gg > 0.5){
			gg = 1.0;
		}else{
			gg = 0.0;
		}
		gl_FragColor = vec4(1.0-gg,1.0-gg,1.0-gg,1.0);//gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)�͕K�{
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


//�쐬���������́i�ړI�j����A""�Ȃ�""��K�v�Ƃ��Ă���̂����t���ōl����Ɖ������₷��

//3.Stencil Texture���쐬���܂�
//2.Alpha Texture����쐬���܂�
//1.�e�N�X�`���[�̍��̕�������Color Texture��Alpha��p�����܂�


