/**
 *	ある点からある方向を見る(例えば、光源からある方向を見る)
 *	To look toward to arbitrary direction at a arbitrary position(e.g. the view of the Sun which is the emission of the ray)
**/

(function(){

var sNameOfShader = "lookFromAPoint";

var fs = (function(){/*
	varying lowp vec4 vColor;



void hncodeFloat(float z){
	mediump vec4 bitShift = vec4(16777216.0,6400.0,256.0,1.0);
	mediump vec4 bitMask = vec4(0.0,1.0/256.0,1.0/256.0,1.0/256.0);

	mediump vec4 zzz = fract(vec4(z)*bitShift);
	zzz -=zzz.xxyz*bitMask;
	gl_FragColor = zzz;
}

	void main(void) {
		mediump vec4 color = vColor.gbra;
		gl_FragColor = color;

//		hncodeFloat(gl_FragCoord.z);

//	gl_FragColor = vec4(1.0,0.0,0.0,1.0);

		//uSamplerの数字とgl.TEXT0の数字は共通？

//		mediump vec4 texelColor = texture2D(uSampler,vTextureCoord);//ja version

//		mediump float gg = 1.0/pow(max(dot(texelColor,texelColor),1.0),3.0);

//		mediump float shadowFlag =1.0;

		/* 0.99 < gl_FragCoord.z < 1.0 */
//		if(gl_FragCoord.z > 0.997){
//			shadowFlag = 1.0;
//		}else{
//			shadowFlag = 0.0;
//		};

		/* gl_Position.z is real z */
//		if(vXYZ.z < 10.0){
//			shadowFlag = 1.0;
//		}else{
//			shadowFlag = 1.0;
//		};

		/* gl_Position.z is real z */
		/* gl_FragDepth is not available ... */
//		if(gl_FragCoord.z == gl_FragDepthEXT/*gl_FragDepth*/){
//			shadowFlag = 1.0;
//		}else{
//			shadowFlag = 0.0;
//		};



		//http://www.chinedufn.com/webgl-shadow-mapping-tutorial/
//?		highp   vec4 texelColor = texture2D(uSampler,vTextureCoord);//en version
//		gl_FragColor = vec4(shadowFlag) * vec4(uBrightness)*vec4(texelColor.rgb * vNTimesEachRGB,(1.0-gg*uCassiniFactor)*uAlpha*texelColor.a);
//		gl_FragColor = encodeFloat(gl_FragCoord.z);

	}
*/});

var vs = (function(){/*
	attribute vec3 aVertexPosition;//x y z
	attribute vec3 aVertexNormal;//x y z
	attribute vec4 aVertexColor;//R G B Alpha
	attribute vec2 aTextureCoord;//x y


	varying lowp vec4 vColor;

	uniform mat4 uOrthographicMatrix;
	uniform mat4 uNotManipulatedMatrix;



	void main(void) {


		vColor = aVertexColor;


		vec3 directional = normalize(uNotManipulatedMatrix * vec4(0.0,0.0,0.0,1.0) - vec4(0.0,0.0,0.0,1.0)).xyz;//means PosSaturn - PosMovedOrigin

		//ここでdirectionalとorthographicMatrixを使って平行光源から見た物体のgl_Possitionを求め、そのgl_Colorを求め、shadowFactorをセットしたのち、perspectiveMatrixを使って新たにgl_Positionを設定しなおし、gl_Colorを設定する。
		//影は、色は黒、alphaは   変化なし  ですからね。


		vec3 centerVector = normalize(cross(directional,vec3(0.0,0.0,-1.0)));//It direct observer's gaze in direction to the Saturn.
		float theta = acos(dot(directional,vec3(0.0,0.0,1.0)));
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
		//mat4 rotateLightDirection= mat4(a11,a12,a13,a14,a21,a22,a23,a24,a31,a32,a33,a34,a41,a42,a43,a44);//元と同じ
		//mat4 rotateLightDirection= mat4(a11,a21,a31,a41,a12,a22,a32,a42,a13,a23,a33,a43,a14,a24,a34,a44);//元の転置


		//第一のpositionにはライトのベクトルの向きと反対方向にrotateするためのmatが必要
//●kkk
		gl_Position = uOrthographicMatrix * rotateLightDirection * uNotManipulatedMatrix * vec4(aVertexPosition,1.0);
//		gl_Position = vec4(0.0,0.0,-10.0,1.0);

		
	}
*/});

fs = fs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");
vs = vs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");
myShaders.createFromVariables(gl,sNameOfShader,vs,fs);
		myShaders.light.getAttribLocation("aVertexPosition");
	//	myShaders[sNameOfShader].getAttribLocation("aVertexNormal");
		myShaders[sNameOfShader].getAttribLocation("aVertexColor");
	//	myShaders[sNameOfShader].getAttribLocation("aTextureCoord");
	//	myShaders[sNameOfShader].getUniformLocation("uPerspectiveMatrix");
	//	myShaders[sNameOfShader].getUniformLocation("uModelViewMatrix");
	//	myShaders[sNameOfShader].getUniformLocation("uPointSizeFloat");
	//	myShaders[sNameOfShader].getUniformLocation("uSampler");
	//	myShaders[sNameOfShader].getUniformLocation("uModelViewMatrixInversedTransposed");
	//	myShaders[sNameOfShader].getUniformLocation("uBaseLight");
	//	myShaders[sNameOfShader].getUniformLocation("uManipulatedRotationMatrix");
	//	myShaders[sNameOfShader].getUniformLocation("uBrightness");
	//	myShaders[sNameOfShader].getUniformLocation("uAlpha");
	//	myShaders[sNameOfShader].getUniformLocation("uCassiniFactor");
	//	myShaders[sNameOfShader].getUniformLocation("uManipulatedMatrix");
		myShaders[sNameOfShader].getUniformLocation("uOrthographicMatrix");
		myShaders[sNameOfShader].getUniformLocation("uNotManipulatedMatrix");
})();

