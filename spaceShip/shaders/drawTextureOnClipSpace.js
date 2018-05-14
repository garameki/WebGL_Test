/**
 *	��̃e�N�X�`���[���f�v�X�e�X�g����ŃN���b�v��Ԃɕ`��(���ꂼ��̃f�v�X�o�b�t�@�e�N�X�`���[���K�v�ł�(24bit))
 *	To draw two textures with depth test (according to each depth texture(24bit) to 'depth test')
**/



(function(){

	var ccc8 = 1/0xFF;
	var c8 = function (a){
		return a*ccc8;
	};
	var ccc24 = 1/0xFFFFFF;
	var c24 = function (a){
		return a*ccc24;
	};

	/* customize below */

	var sNameOfShader = "drawTextureOnClipSpace";
	var sModeOfFBO = "CNDNSN";//to turn of the frame buffer //C[NTR]D[NTR]S[NTR]//�g��Ȃ�
	var colorBufferModeOfFBO = myFBOs.none;//[none | colorBufferModeIsRGBA4444 | colorBufferModeIsRGBA5551 | colorBufferModeIsALPHA]
	var controllColorDepthStencilOfFBO = function(gl){

	/** BLEND ���̌��ʂ�alpha<1.0�̂Ƃ��Ɍ���܂��B**/
	gl.disable(gl.BLEND);//https://stackoverflow.com/questions/11633950/opengl-blend-modes-vs-shader-blending
//	gl.enable(gl.BLEND);
//	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);//�e�N�X�`���̍��͓���
	gl.blendFunc(gl.SRC_COLOR,gl.ONE_MINUS_SRC_COLOR);

	/** COLOR **/
	gl.colorMask(true,true,true,true);


	/** DEPTH **/
//	gl.disable(gl.DEPTH_TEST);
	gl.enable(gl.DEPTH_TEST);//shader����gl_FragCoord.z���Q�Ƃ������̂���===> �O�p�`��z�������邾�� We can get z of this triangles
	gl.clearDepth(c24(0xFFFFFF));
//	gl.clearDepth(1.0);
	gl.clear(gl.DEPTH_BUFFER_BIT);
	gl.depthFunc(gl.LEQUAL);

//kkk shader���ŐV����DEPTH BUFFER TEXTURE����肽�����!!!!gl_FragCoord.z = �Ƃ���΂悢�̂ł��傤��?
//	����āA�e�X�g���Ă݂܂��傤spaceShip shader�̂��0.0�ɂ��āA�ǂ��Ȃ邩���ώ@���܂��傤

	/** STENCIL **/
	gl.disable(gl.STENCIL_TEST);

	
};


var fs = (function(){/*
	uniform sampler2D uSampler;//color buffer of source

	varying mediump vec2 vCoord;
	void main(void){

		gl_FragColor = vec4(texture2D(uSampler,vCoord).rgb,1.0);

	}
*/});

var vs = (function(){/*
	attribute vec2 aVertexPosition;

	varying mediump vec2 vCoord;
	void main(void){
		
		vCoord = aVertexPosition.xy * 0.5 + 0.5;
		gl_Position = vec4(aVertexPosition,0.0,1.0);//x y z w

	}
*/});

fs = fs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");
vs = vs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");

var aAttribs = [
	"aVertexPosition"
];
var aUniforms = [
	"uSampler"
];
var funcShader = function(){
	myShaders.create(sNameOfShader,vs,fs,aAttribs,aUniforms);
};
if('myShaders' in window){
	console.log(sNameOfShader + "---ok1---created in myShaders");
	funcShader();
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
			funcShader();
		}
	},1);
}
var funcFBO = function(){
	myFBOs.create(sNameOfShader,sModeOfFBO,colorBufferModeOfFBO,controllColorDepthStencilOfFBO);//null---Color buffer is not to use.
};
if('myFBOs' in window){
	console.log(sNameOfShader + "---ok1---created in myShaders");
	funcFBO();
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
			funcFBO();
		}
	},1);
}

})();
