/**
 *	物体の影を任意の平面に落とします
 *	To make a object its shadow putting on a arbitrary plane 
**/


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

		highp vec3 nn = normalize(((uModelViewMatrixInversedTransposed * vec4(0.0,0.0,-1.0,1.0))).xyz);//リングの法線
		highp vec3 pos0 = (uManipulatedMatrix * vec4(0.0,0.0,0.0,1.0)).xyz;//移動後の原点の位置
		highp vec3 pos1 = (uModelViewMatrix * vec4(aVertexPosition,1.0)).xyz;//対象の点
		highp vec3 pos3 = (uModelViewMatrix * vec4(0.0,0.0,0.0,1.0)).xyz;//リングの中心

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

myShaders.createFromVariables(gl,sNameOfShader,vs,fs);
		myShaders[sNameOfShader].getAttribLocation("aVertexPosition");
		myShaders[sNameOfShader].getAttribLocation("aTextureCoord");
		myShaders[sNameOfShader].getUniformLocation("uSampler");
		myShaders[sNameOfShader].getUniformLocation("uModelViewMatrixInversedTransposed");
		myShaders[sNameOfShader].getUniformLocation("uModelViewMatrix");
		myShaders[sNameOfShader].getUniformLocation("uPerspectiveMatrix");

		myShaders[sNameOfShader].getUniformLocation("uManipulatedMatrix");


})();