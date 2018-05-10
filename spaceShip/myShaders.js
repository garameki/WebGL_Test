﻿//******************************* SHADER PROGMRAMS *****************************************************-->
//--drawTextureOnClipSpaceWithMakingBlackPartTransparentPart
<script id="drawTextureOnClipSpaceWithMakingBlackPartTransparentPart-fs" type="x-shader/x-fragment">
	uniform sampler2D uSampler;

	varying lowp vec2 vCoord;
	void main(void){
		highp float newCoordX = (vCoord.x + 1.0) * 0.5;
		highp float newCoordY = (vCoord.y + 1.0) * 0.5;
		highp vec2 newCoord = vec2(newCoordX,newCoordY);
		highp vec3 rgb = texture2D(uSampler,newCoord).rgb;
//		highp float brightness = dot(rgb,rgb);
//		highp float alpha=1.0;
//		if(brightness > 0.3){
//			rgb = vec3(1.0);//alpha = 0.0;
//		}else{
//			rgb = vec3(0x0F/0xFF);//alpha = 1.0;
//		};
		gl_FragColor = vec4(rgb,1.0);//alpha);z

	//	discard;
	}
</script>
<script id="drawTextureOnClipSpaceWithMakingBlackPartTransparentPart-vs" type="x-shader/x-vertex">
	attribute vec2 aVertexPosition;

	varying lowp vec2 vCoord;
	void main(void){
		
		gl_Position = vec4(aVertexPosition,0.0,1.0);//x y z w
		vCoord = aVertexPosition.xy;
	}
</script>
<!--drawTextureOnClipSpace-->
<script id="drawTextureOnClipSpace-fs" type="x-shader/x-fragment">
	uniform sampler2D uSampler;

	varying lowp vec2 vCoord;
	void main(void){
		lowp float newCoordX = (vCoord.x + 1.0) * 0.5;
		lowp float newCoordY = (vCoord.y + 1.0) * 0.5;
		lowp vec2 newCoord = vec2(newCoordX,newCoordY);

		gl_FragColor = vec4(texture2D(uSampler,newCoord).rgb,1.0);

	//	discard;
	}
</script>
<script id="drawTextureOnClipSpace-vs" type="x-shader/x-vertex">
	attribute vec2 aVertexPosition;

	varying lowp vec2 vCoord;
	void main(void){
		
		gl_Position = vec4(aVertexPosition,0.0,1.0);//x y z w
		vCoord = aVertexPosition.xy;
	}
</script>
<!--drawTextureDepthBufferOnClipSpace-->
<script id="drawTextureDepthBufferOnClipSpace-fs" type="x-shader/x-fragment">
	uniform sampler2D uSampler;

	varying lowp vec2 vCoord;
	void main(void){
		lowp float newCoordX = (vCoord.x + 1.0) * 0.5;
		lowp float newCoordY = (vCoord.y + 1.0) * 0.5;
		lowp vec2 newCoord = vec2(newCoordX,newCoordY);

		lowp vec3 depth = texture2D(uSampler,newCoord).rgb;

		gl_FragColor = vec4((depth - vec3(0.9998)) * 5000.0,1.0);//遠いものよりも近いもの方がDEPTHが細かく感じられる

	//	discard;
	}
</script>
<script id="drawTextureDepthBufferOnClipSpace-vs" type="x-shader/x-vertex">
	attribute vec2 aVertexPosition;

	varying lowp vec2 vCoord;
	void main(void){
		
		gl_Position = vec4(aVertexPosition,0.0,1.0);//x y z w
		vCoord = aVertexPosition.xy;
	}
</script>



<!--ringshadow shader-->
<script id="ringshadowFragmentShader" type="x-shader/x-fragment">

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
</script>
<script id="ringshadowVertexShader" type="x-shader/x-vertex">
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
</script>


<!--light shader-->
<script id="lightFragmentShader" type="x-shader/x-fragment">
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
</script>
<script id="lightVertexShader" type="x-shader/x-vertex">

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
</script>





<!-- normal shader -->
<script id="shader-fs" type="x-shader/x-fragment">
//hint
//	varying lowp vec4 vColor;	//as same as vertex shader
//	varying lowp vec2 vTextureCoord;//as same as vertex shader
//	varying lowp vec3 vNTimesEachRGB;//as same as vertex shader
	varying highp vec4 vColor;//●	//as same as vertex shader
	varying highp vec2 vTextureCoord;//as same as vertex shader
	varying highp vec3 vNTimesEachRGB;//as same as vertex shader

	uniform mediump float uBrightness;
	uniform mediump float uAlpha;
	uniform mediump float uCassiniFactor;//if zero , not avairable,,if 1 , avairable
	uniform sampler2D uSampler;//common variable between shader and js

	void main(void) {

	/* method 1 */
	//	gl_FragColor = texture2D(uSampler,vTextureCoord);

	/* method 2 */
	//	gl_FragColor = vColor;

		//uSamplerの数字とgl.TEXT0の数字は共通

	/* method 3 */
	//	mediump vec4 texelColor = texture2D(uSampler,vTextureCoord);//ja version
	//	mediump float gg = 1.0/pow(max(dot(texelColor,texelColor),1.0),3.0);//暗いものほど透明にする
	//	mediump float shadowFlag =1.0;
	//	gl_FragColor = vec4(shadowFlag) * vec4(uBrightness)*vec4(texelColor.rgb * vNTimesEachRGB,(1.0-gg*uCassiniFactor)*uAlpha*texelColor.a);

	/* method 4 */
		highp vec4 texelColor = texture2D(uSampler,vTextureCoord);//ja version
		highp float gg = 1.0/pow(max(dot(texelColor,texelColor),1.0),3.0);//暗いものほど透明にする
		gl_FragColor = vec4(uBrightness)*vec4(texelColor.rgb * vNTimesEachRGB,(1.0-gg*uCassiniFactor)*uAlpha*texelColor.a);
	}
</script>





<!--Vertex shader-->
<script id="shader-vs" type="x-shader/x-vertex">

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

//hint
//	varying lowp vec4 vColor;
//	varying lowp vec2 vTextureCoord;
//	varying lowp vec3 vNTimesEachRGB;
	varying highp vec4 vColor;
	varying highp vec2 vTextureCoord;
	varying highp vec3 vNTimesEachRGB;


	void main(void) {
//●kkk
		gl_Position = uPerspectiveMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);

		gl_PointSize = uPointSizeFloat;
		vColor = aVertexColor;
		vTextureCoord = aTextureCoord;

		//分ける　位置ベクトル　と　方向ベクトル
		//位置ベクトル....移動できる　回転できる
		//方向ベクトル....回転できる

/*
/ * How to simulate 1 directional and ambient light
/ * //		//prepare Normal
/ * /		vec4 transformedNormal = uModelViewMatrixInversedTransposed * vec4(aVertexNormal,1.0);
/ * /		//prepare Light 1
/ * /		vec3 directional = normalize(vec3(0.0,0.0,1.0));
/ * /		vec3 directionalNew = vec3(2.0) * normalize(uManipulatedRotationMatrix * vec4(directional,1.0)).xyz;//(intension of light)*2//a new position of the light
/ * /		//calculation intensity of lit surface
/ * /		float quantity = max(dot(transformedNormal.xyz,directionalNew),uBaseLight);//scalar quantity as the light intensity
/ * /		//set color of light
/ * /		vec3 directionalLightColor = vec3(1,1,1);
/ * /		//set color of ambient light
/ * /		vec3 ambientLight = vec3(0.1,0.1,0.1);//This is not the direction but the intensity of color.It does not have relationship with Normal Vector in vertex data.It relates with only 'gl_Color'.
/ * /		//calc total
/ * /		vNTimesEachRGB = ambientLight + (directionalLightColor * quantity);
****/

/*****
/ * /	// a effect    please go inside of planets
/ * /		vec4 transformedNormal = uModelViewMatrixInversedTransposed * vec4(aVertexNormal,1.0);
/ * /		vec4 directional = uModelViewMatrixInversedTransposed * vec4(aVertexPosition,1.0);
/ * /		directional = directional / directional.w;
/ * /		float quantity = max(dot(normalize(transformedNormal.xyz),directional.xyz),uBaseLight);//scalar quantity as the light intensity
/ * /		vec3 directionalLightColor = vec3(1,1,1);//RGB intensity
/ * /		vec3 ambientLight = vec3(0.1,0.1,0.1);//This is not the direction but the intensity of color.It does not have relationship with Normal Vector in vertex data.It relates with only 'gl_Color'.
/ * /		vNTimesEachRGB = ambientLight + (directionalLightColor * quantity);
*****/

	//point lighting
		//prepare Normal
		vec4 transformedNormal = uModelViewMatrixInversedTransposed * vec4(aVertexNormal,1.0);
		
//原点の移動後の位置を引く必要がある-->移動(by manipulation)する前の位置が、その位置
		//prepare light vectorg
//		vec4 directional = uModelViewMatrixInversedTransposed * vec4(aVertexPosition,1.0);
//		directional = directional / directional.w;
		vec4 directional = -vec4(1.5) * normalize(uModelViewMatrix * vec4(aVertexPosition,1.0) - uManipulatedMatrix * vec4(0.0,0.0,0.0,1.0));//自分の中を照らしてるだけ
//		vec4 directional = normalize(uModelViewMatrix * vec4(aVertexPosition,1.0) - uModelViewMatrix * vec4(0.0,0.0,0.0,1.0));//中も外も明るい
//対象点の移動行列 * 対象点の元の位置ベクトル - 原点の移動にかかった行列 * 原点の元の位置ベクトル
//		vec4 directional = normalize(uModelViewMatrix * vec4(aVertexPosition,0.0));//平行移動の効果を無くす// = normalize(uModelViewMatrix * vec4(aVertexPosition,1.0) - uModelViewMatrix * vec4(0.0,0.0,0.0,1.0));
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
	}

</script>

<script type='text/javascript'>
/**
 * print informations on html element
**/
(function(){
//:myInfo
	myInfo = { };

	Object.defineProperty(myInfo,'create',{value:create,writable:true,enumerable:false,configurable:false});
	function create(sName,nLeft,nTop){
		Object.defineProperty(myInfo,sName,{value:new PrintText(sName,nLeft,nTop),writable:false,enumerable:true,configurable:false});
		Object.defineProperty(myInfo[sName],'createLine',{value:createLine(sName),writable:false,enumerable:true,configurable:false});
	};
	function createLine(sName){
		return function(sNameChild,sColor,sBackColor,nSize){
			myInfo[sName].elep.innerHTML+="<span class='"+sName+sNameChild+"'></span><br>";
			//https://stackoverflow.com/questions/30070865/event-that-occurs-after-appendchild
			var targets,target,count=0;
			var hoge = setInterval(function(){
				targets = myInfo[sName].elep.getElementsByClassName(sName+sNameChild);
				if(targets.length!=0){
					clearInterval(hoge);
					target = targets[0];
					target.style.color = sColor;
					target.style.backgroundColor = sBackColor;
					target.style.fontSize = nSize;
					if(myInfo[sName][sNameChild]!=void 0){
						console.error("too early to use the setter 'myInfo."+sName+"."+sNameChild+"='");
					}
					Object.defineProperty(myInfo[sName],sNameChild,{set:function(str){
						target.innerText=str;
					},enumerable:true,configurable:false});
				}else if(++count>100){
					clearInterval(hoge);
					console.error("myInfo."+sName+"."+sNameChild+" might be not able to attach withinto DOM.");
				}
			},0.001);
		};
	};
	/** inner class **/
	var body;
	function PrintText(sName,nLeft,nTop){
		body = document.getElementsByTagName('body');
		if(body.length==0){
			console.caution("DOM is not ready yet about 'myInfo."+sName+"', too early to use");
			return null;
		}
		var elep = document.createElement('P');
		body[0].appendChild(elep);
		elep.style.position='absolute';
//		elep.style.zIndex=10000;
		elep.style.left=nLeft.toString()+'px';
		elep.style.top=nTop.toString()+'px';
		elep.style.padding='15px';
		elep.style.borderStyle='dashed';
		elep.style.borderColor='gold';
		elep.style.borderWidth='8px';

		this.elep = elep;

		elep.innerHTML="<span style='padding-left:5px;padding-right:5px;color:white;background-color:blue;position:absolute;left:-15px;top:-10px;'>"+sName+"</span>";
	};
	Object.defineProperty(PrintText.prototype,'caution',{set:setterCaution,enumerable:true,configurable:false});
	function setterCaution(str){
		this.print(str,"black","yellow");
	};
	Object.defineProperty(PrintText.prototype,'error',{set:setterError,enumerable:true,configurable:false});
	function setterError(str){
		this.print(str,"white","red");
	};
	Object.defineProperty(PrintText.prototype,'info',{set:setterInformation,enumerable:true,configurable:false});
	function setterInformation(str){
		this.print(str,"white","blue");
	};

	/** inner function **/
	var styleCommon = 'font-size:12px;padding-left:5px;padding-right:5px;';
	PrintText.prototype.print = function(str,sFColor,sBColor){
		this.elep.innerHTML+="<span style='color:"+sFColor+";background-color:"+sBColor+";"+styleCommon+"'>・"+str+"</span><br>";		
	};


})();
/**
 *print text on html
*/
(function(){
//:myline
	myLine = { };
	Object.defineProperty(myLine,'create',{value:create,writable:false,enumerable:false,configurable:false});
	var body;
	function create(sName,nLeft,nTop,sColor,sBackColor,nSize){
		body = document.getElementsByTagName('body');
		if(body.length==0){
			console.error("DOM is not ready yet about 'myInfo."+sName+"'");
			return null;
		}
		var elep = document.createElement('SPAN');
		body[0].appendChild(elep);
		elep.style.position='absolute';
		elep.style.left=nLeft.toString()+'px';
		elep.style.top=nTop.toString()+'px';
		elep.style.color=sColor;
		elep.style.backgroundColor=sBackColor;
		elep.style.fontSize = nSize;
		Object.defineProperty(myLine,sName,{set:function(str){
//			str = str.toDetoxification(str);//myClass
			elep.innerText=str;
		},enumerable:true,configurable:false});
	};
})();
/**
 * make shader
*/
(function(){
//:myshaders
	myShaders = { };

	/** Property **/
	Object.defineProperty(myShaders,'create',{value:create,writable:false,enumerable:false,configurable:false});
	function create(sName,sIdVertex,sIdFragment,gl){
		Object.defineProperty(myShaders,sName,{value:new Shader(sName,sIdVertex,sIdFragment,gl),writable:false,enumerable:true,configrable:false});
	};
	/** inner class **/
	var Shader = function(sNameShader,sIdVertex,sIdFragment,gl){
		this.gl = gl;
		this.programName = sNameShader;

		//read & compile
		var fragmentShader = getShader(gl,sIdFragment);
		var vertexShader = getShader(gl,sIdVertex);

		//make shader program
		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram,vertexShader);
		gl.attachShader(shaderProgram,fragmentShader);
		gl.linkProgram(shaderProgram);

		//alert in case of falure
		if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)){
			alert("can't link both of the shaders vs:'"+sIdVertex+"',fs:'"+sIdFragment+"'");
			this.program = null;
		}else{
			this.program = shaderProgram;
			this.program._name = sNameShader;
		}

		this.attrib = { };
//●kkk		Object.defineProperty(this.attrib,'disableA',{,enumerable:,configurable:});
		this.uniform = { };
	};
	Shader.prototype.activate = function(){
		if(this.program==null){
			alert("can't activate program '"+this.programName+"'");
		}else{
			this.gl.useProgram(this.program);
		}
	};

	/** inner function **/
	function getShader(gl,id){
		var shaderScript,theSource,currentChild,shader;

		shaderScript = document.getElementById(id);

		if(!shaderScript) {
			return null;
		}

		theSource = "";
		currentChild = shaderScript.firstChild;

		while(currentChild) {
			if(currentChild.nodeType == currentChild.TEXT_NODE){
				theSource += currentChild.textContent;
			}
			currentChild = currentChild.nextSibling;
		}

		if (shaderScript.type == "x-shader/x-fragment"){
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		} else if (shaderScript.type == "x-shader/x-vertex"){
			shader = gl.createShader(gl.VERTEX_SHADER);
		} else {
			// unknown shader type
			myInfo.main.error="Unknown shader type.The element type of shader program must be 'x-shader/x-vertex' or 'x-shader/x-fragment' now.";
			return null;
		}

		gl.shaderSource(shader,theSource);

		gl.compileShader(shader);

		//recognize whether success to compile or not
		if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) {
			alert("Shader compile error occured : " + id + " : " + gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	};
//●lll
	/** For attribute variable **/
	Shader.prototype.getAttribLocation = function(sNameVariable){
		Object.defineProperty(this.attrib,sNameVariable,{value:new AttribVariable(this.gl,this.program,sNameVariable,this.programName),writable:false,enumerable:true,configurable:false});
	};
	/** inner class **/
	const normalize = false;
	const stride = 0;//shaderを呼び出すごとに進むバイト数//これは(buffer.slice((offset + i) * stride,size);)という意味
	const offset = 0;
	var AttribVariable = function(gl,prog,name,progName){
		this.gl = gl;
		this.loc = gl.getAttribLocation(prog,name);
		if(this.loc == -1 || this.loc == null){
			myInfo.main.error="Can't initialize attribute type of '"+name+"' variable, such that it's not used nor exist in '"+progName+"' shader.";
		} else {
			//●myInfo.main.info="'"+name+"' was enabled in '"+progName+"' program.";
		}
	};
	var flagError = false;
	AttribVariable.prototype.assignBuffer = function(buffer,numComponents){
		if(buffer==void 0 && !flagError){
			myInfo.main.error="buffer="+buffer+" in AttribVariable.prototype.assinBuffer()";
			flagError = true;
			stop();
		};
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER,buffer);
		this.gl.enableVertexAttribArray(this.loc);
		this.gl.vertexAttribPointer(this.loc,numComponents,this.gl.FLOAT,normalize,stride,offset);

//console.log("arrayBuffer=",this.gl.getParameter(this.gl.ARRAY_BUFFER_BINDING)," was pointed");
	};
	AttribVariable.prototype.assignArray = function(arr,numComponents){
		var buff = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER,buff);
		this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(arr),this.gl.STATIC_DRAW);
		this.gl.enableVertexAttribArray(this.loc);
		this.gl.vertexAttribPointer(this.loc,numComponents,this.gl.FLOAT,normalize,stride,offset);
	};


	/** For uniform variable **/
	Shader.prototype.getUniformLocation = function(sNameVariable){
		Object.defineProperty(this.uniform,sNameVariable,{value:new UniformVariable(this.gl,this.program,sNameVariable,this.programName),writable:false,enumerable:true,configurable:false});
	};
	/** inner class **/
	var UniformVariable = function(gl,prog,name,progName){
		this.gl = gl;
		this.loc = gl.getUniformLocation(prog,name);
		if(this.loc == -1 || this.loc == null){
			myInfo.main.error="Can't initialize uniform type of '"+name+"' variable, such that it's not used nor exist in '"+progName+"' shader.";
			stop();
		}
	};
	UniformVariable.prototype.sendFloat32Array = function(arr){
		this.gl.uniformMatrix4fv(this.loc,false,new Float32Array(arr));
	};
	UniformVariable.prototype.sendInt = function(value){
		this.gl.uniform1i(this.loc,value);
	};
	UniformVariable.prototype.sendFloat = function(value){
		this.gl.uniform1f(this.loc,value);
	};
})();








//********************************** VALUES FOR SHADER ****************************************

function sendOrthographicMatrix(gl,vari){

		//https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/orthographic-projection-matrix		from cite site:
		//orthographic matrix...myMat4 already has a property defined
	var right = 2500.0;
	var left = -2500.0;
	var top = 2500.0;
	var bottom = -2500.0;
	var far = 2500.0;
	var near = -2500.0;
	var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

	myMat4.loadOrthography(left,right,top,bottom,near,far,aspect);
	vari.sendFloat32Array(myMat4.arr);

};



function sendPerspectiveMatrix(gl,vari){

	/*
		from cite site:
		Create a perspective matrix, a special matrix that is
		used to simulate the distortion of perspective in a camera.
		Our field of view is 45 degrees, with a (width/height)
		ratio that matches the display size of the canvas
		and we only want ot see objects between 0.1 units
		and 100 units away from the camera.
	*/
		//perspective matrix...myMat4 already has a property defined about this
//	var fieldOfView = 70 * Math.PI / 180;	//in radian;
	var fieldOfView = 70 * Math.PI / 180;	//in radian;
	var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	var zNear = 0.01;
	var zFar = 10000000.0;

	myMat4.loadPerspective(fieldOfView,aspect,zNear,zFar);
	vari.sendFloat32Array(myMat4.arr);
};
function sendModelViewMatrixInversedTransposed(vari,mvMatrix){
 	//各面の法線ベクトルの向きを更新＆拡大縮小にともなうずれを修正してくれる便利なベクトルをシェーダーに送る。
 	//send a matrix which rotates and translate normal vector and which makes the direction of normal vectors correct,especially when magnifiring was done to its body

	//https://msdn.microsoft.com/ja-jp/library/ms810476.aspx
	//	says the reason 'inverse & transpose' in this article above
	myMat4.load(mvMatrix);
	myMat4.inverse();
	myMat4.transpose();
	vari.sendFloat32Array(myMat4.arr);
};
function sendAccumeratedMatrix(vari,arrAccumelateToMyMat4,timeSpan){//to get a matrix computed from many kind purpose matrices to accumerate
	myMat4.loadIdentity();
	for(var ii=0,len=arrAccumelateToMyMat4.length;ii<len;ii++){
		arrAccumelateToMyMat4[ii](timeSpan);
	}
	vari.sendFloat32Array(myMat4.arr);
};

//************************************** DRAW SCENE *************************************************
var drawPlanets = function(gl,names,angle){
	for(var num in names){//the last is the texture that is gotten by framebuffer
		member = UnitsToDraw[names[num]];
		/** To vertex shader **/
		myShaders.camera.attrib.aVertexPosition.assignBuffer(member.buffers.position,3);
		myShaders.camera.attrib.aVertexNormal.assignBuffer(member.buffers.normal,3);
		myShaders.camera.attrib.aVertexColor.assignBuffer(member.buffers.color,4);
		myShaders.camera.attrib.aTextureCoord.assignBuffer(member.buffers.texture,2);
		member.buffers.bindElement();

		sendPerspectiveMatrix(gl,myShaders.camera.uniform.uPerspectiveMatrix);
		pmat = myMat4.arr;//sended data above
		sendAccumeratedMatrix(myShaders.camera.uniform.uModelViewMatrix,member.aAccumeUnits,angle);
		mvmat = myMat4.arr;//sended data above
		sendModelViewMatrixInversedTransposed(myShaders.camera.uniform.uModelViewMatrixInversedTransposed,mvmat);
//		sendAccumeratedMatrix(myShaders.camera.uniform.uManipulatedRotationMatrix,member.aAccumeUnitsLightDirectional,angle);
		sendAccumeratedMatrix(myShaders.camera.uniform.uManipulatedMatrix,member.aAccumeUnitsLightPoint,angle);
		myShaders.camera.uniform.uBaseLight.sendFloat(member.baseLight);
		myShaders.camera.uniform.uPointSizeFloat.sendFloat(3.0);
		/** Tofragment shader **/
		myShaders.camera.uniform.uBrightness.sendFloat(member.brightness);
		myShaders.camera.uniform.uAlpha.sendFloat(member.alpha);
		myShaders.camera.uniform.uCassiniFactor.sendFloat(member.cassiniFactor);
		myShaders.camera.uniform.uSampler.sendInt(0);//gl.TEXTURE0<---variable if you prepared another texture as gl.TEXTURE1, you can use it by setting uSampler as 1.

		myTextures.member[member.nameTexture].activate();

		member.draw();//in which texture activated is for use
		member.labels.repos(gl,pmat,mvmat);
	}//camera


};

var drawShadows = function(gl,names,angle){

	for(var num in names){//the last is the texture that is gotten by framebuffer
		member = UnitsToDraw[names[num]];
			myShaders.ringshadow.attrib.aVertexPosition.assignBuffer(member.buffers.position,3);
			myShaders.ringshadow.attrib.aTextureCoord.assignBuffer(member.buffers.texture,2);
			member.buffers.bindElement();
			sendPerspectiveMatrix(gl,myShaders.ringshadow.uniform.uPerspectiveMatrix);
			sendAccumeratedMatrix(myShaders.ringshadow.uniform.uManipulatedMatrix,member.aAccumeUnitsLightPoint,angle);
			sendAccumeratedMatrix(myShaders.ringshadow.uniform.uModelViewMatrix,member.aAccumeUnits,angle);
			mvmat = myMat4.arr;//sended data above
			sendModelViewMatrixInversedTransposed(myShaders.ringshadow.uniform.uModelViewMatrixInversedTransposed,mvmat);
			myTextures.member[member.nameTexture].activate();
			myShaders.ringshadow.uniform.uSampler.sendInt(0);
		member.draw();
	}
};

var stencil_status = function(gl){
	myInfo.main.stencilwritemask = "stencil mask front:"+gl.getParameter(gl.STENCIL_WRITEMASK).toString(16);
	myInfo.main.stencilbackwritemask = "stencil mask back:"+gl.getParameter(gl.STENCIL_BACK_WRITEMASK).toString(16);
	myInfo.main.stencilbits = "stencil bit length: "+gl.getParameter(gl.STENCIL_BITS);
	myInfo.main.stencilfunc = "stencilFunc("+gl[gl.getParameter(gl.STENCIL_FUNC)]+","+gl.getParameter(gl.STENCIL_REF).toString(2)+","+gl.getParameter(gl.STENCIL_VALUE_MASK).toString(2)+")";
};


var ccc8 = 1/0xFF;
var c8 = function (a){
	return a*ccc8;
};
var ccc24 = 1/0xFFFFFF;
var c24 = function (a){
	return a*ccc24;
};


//:drawscene
//:scene
function drawScene(gl,angle){

	var member,mvmat,pmat;


/** idea **

	aAccumeUnits.push(dfsfdsfsfs);

	aAccumeUnits.create("saturn");
	aAccumeUnits.saturn.push(dkjfladjf,"manipu");//push with tag classified
	aAccumeUnits.saturn.push(dkjfladjf,"rot");
	aAccumeUnits.saturn.push(dkjfladjf,"trans");
	...
	mat = aAccumeUnits.saturn.accumeAll();
	mat = aAccumeUnits.saturn.accumeNotRotate();//using query
	mat = aAccumeUnits.saturn.accumeNotTranslte();//using query
	mat = aAccumeUnits.saturn.accumeNotManipulated();//...
	mat = aAccumeUnits.saturn.accumeManipulated();//...

	myShader.camera.uniform.uNotManipulatedMatrix.sendFlorat32Array(mat);//for example
*/



//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: 0 :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	//フレームバッファ(shadow)をclear & turn on
//	myFBOs.shadow.reset();
//	myFBOs.shadow.activate();

	//color
	gl.clearColor(c8(0x00),c8(0x00),c8(0x00),c8(0x00));
//	gl.clearColor(c8(0xFF),c8(0xFF),c8(0xFF),c8(0xFF));
	gl.clear(gl.COLOR_BUFFER_BIT);
//	gl.colorMask(false,false,false,false);
//	gl.colorMask(true,true,true,true);

	//depth
//	gl.enable(gl.DEPTH_TEST);
//	gl.disable(gl.DEPTH_TEST);
//	gl.clearDepth(c24(0xFFFFFF));
//	gl.clear(gl.DEPTH_BUFFER_BIT);
//	gl.depthFunc(gl.LEQUAL);

	//stencil
//	gl.enable(gl.STENCIL_TEST);
//	gl.disable(gl.STENCIL_TEST);
//	gl.clearStencil(0xFF);//クリア時にstencil bufferを埋め尽くす値
//	gl.clear(gl.STENCIL_BUFFER_BIT);

	//blend
	//Final Color = ObjectColor * SourceBlendFactor(テクスチャ) + PixelColor * DestinationBlendFactor(画面) //https://msdn.microsoft.com/ja-jp/library/cc324560.aspx
//	gl.disable(gl.BLEND);
//	gl.enable(gl.BLEND);//後に描かれたものが前に描かれたものとブレンドされる//https://sites.google.com/site/hackthewebgl/learning-webglhon-yaku/the-lessons/lesson-8
				//---> ①奥の太陽②手前の輪---○　①手前の輪②奥の太陽---X
//	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
//	gl.blendFunc(gl.ONE_MINUS_SRC_ALPHA,gl.SRC_ALPHA);
//	gl.blendFunc(gl.SRC_ALPHA,gl.ONE);

gl.disable(gl.BLEND);
gl.disable(gl.DEPTH_TEST);
gl.disable(gl.STENCIL_TEST);
//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	myFBOs.shadow.reset();
	myFBOs.shadow.activate("CRDTSN");

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: 4 :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	//draw opaque objects at first!! After this ,draw transparent objects

	gl.disable(gl.BLEND);

	gl.clearColor(c8(0x00),c8(0x00),c8(0x00),c8(0x00));
	gl.clear(gl.COLOR_BUFFER_BIT);


	gl.clearDepth(0xFFFFFF);
//		gl.clearDepth(0x0);
	gl.clear(gl.DEPTH_BUFFER_BIT);
	gl.depthFunc(gl.LEQUAL);



	gl.clearStencil(0xFF);
	gl.clear(gl.STENCIL_BUFFER_BIT);
		gl.stencilFunc(gl.LEQUAL,0xFF,0xFF);
		gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);
		gl.stencilOp(gl.REPLACE,gl.REPLACE,gl.REPLACE);

//	var names = ["earth","plane","saturn","up","right","back","uranus","moon","mars","venus","jupiter","sun","mercury"];//<-----JUPITERからrenderされる
	var names = ["earth","saturn","up","right","back","uranus","moon","mars","venus","jupiter","sun","mercury"];//<-----JUPITERからrenderされる
	myShaders.camera.activate();
		drawPlanets(gl,names,angle);

//:::::::::::::::::::::::::: 1. draw ring without the part of depth at cassini :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

if(true){

if(false){
	//screenの何も書かれていないところに前のcolorがあった場合には透過する

	//Final Color = ObjectColor * SourceBlendFactor + PixelColor * DestinationBlendFactor //https://msdn.microsoft.com/ja-jp/library/cc324560.aspx
	//ブレンディングは透過とは違う//https://sites.google.com/site/hackthewebgl/learning-webglhon-yaku/the-lessons/lesson-8
	gl.clearColor(c8(0x00),c8(0x00),c8(0x00),c8(0x00));//これだとscreenが透過する(blend時)
//		gl.clearColor(c8(0xFF),c8(0xFF),c8(0xFF),c8(0xFF));//これだとscreenが真っ黒(blend時)
	gl.clear(gl.COLOR_BUFFER_BIT);
//		gl.colorMask(false,false,false,true);
//	gl.colorMask(true,true,true,true);

	gl.disable(gl.DEPTH_TEST);
//		gl.enable(gl.DEPTH_TEST);
//		gl.clearDepth(c24(0xFFFFFF));
//		gl.clear(gl.DEPTH_BUFFER_BIT);
//		gl.depthFunc(gl.LEQUAL);

	gl.disable(gl.STENCIL_TEST);
//	gl.enable(gl.STENCIL_TEST);
	gl.clearStencil(0xFF);
	gl.clear(gl.STENCIL_BUFFER_BIT);
	gl.stencilFunc(gl.EQUAL,0xFE,0xFE);
//	gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);
	gl.stencilOp(gl.KEEP,gl.KEEP,gl.REPLACE);//trueの部分にOperationが加わり、ステンシルバッファが書き換えられる
}//boolean
	myShaders.camera.activate();
		names = ["ring"];
		drawPlanets(gl,names,angle);
}//boolean

//:::::::::::::::::::::::::::::: 2. draw the shadow of the Saturn ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


if(true){

	//レンダーバッファを深度バッファにして、シェーダー内でテクスチャーとして使えば、なんとかなるのか
	//だから、2枚のテクスチャーを用意して、一枚は深度ステンシルバッファ、もう一枚はカラーバッファとして使えばいいのか
if(false){

	gl.enable(gl.BLEND);//後に描かれたものが前に描かれたものとブレンドされる//https://sites.google.com/site/hackthewebgl/learning-webglhon-yaku/the-lessons/lesson-8
				//---> ①奥の太陽②手前の輪---○　①手前の輪②奥の太陽---X
//	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
//	gl.blendFunc(gl.ONE_MINUS_SRC_ALPHA,gl.SRC_ALPHA);
//	gl.blendFunc(gl.SRC_ALPHA,gl.ONE);


//●	gl.blendFunc(gl.,gl.);//destinationの黒い部分には黒色を付けない


	gl.disable(gl.DEPTH_TEST);
//	gl.enable(gl.DEPTH_TEST);
//	gl.clearDepth(c24(0x0));
//	gl.clear(gl.DEPTH_BUFFER_BIT);
	gl.depthFunc(gl.NOTEQUAL);

//	gl.disable(gl.STENCIL_TEST);
	gl.enable(gl.STENCIL_TEST);
//	gl.clearStencil(0xFF);
//	gl.clear(gl.STENCIL_BUFFER_BIT);
	gl.stencilFunc(gl.EQUAL,0xFE,0xFF);
	gl.stencilOp(gl.KEEP,gl.KEEP,gl.REPLACE);
//	gl.stencilOp(gl.KEEP,gl.REPLACE,gl.KEEP);
//	gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);



	stencil_status(gl);

}//boolean


	myShaders.ringshadow.activate();
		names = ["saturn2"];
		drawShadows(gl,names,angle);
}//boolean


// ::::::::::::::::::::::::::::::::::: replace the contents of screen :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	
	myInfo.main.framebuffer = "FRAME BUFFER NAME:"+(gl.getParameter(gl.FRAMEBUFFER_BINDING)!=null ? eval(gl.getParameter(gl.FRAMEBUFFER_BINDING))._name : null);
	myInfo.main.renderbuffer = "RENDER BUFFER NAME:"+(gl.getParameter(gl.RENDERBUFFER_BINDING)!=null ? eval(gl.getParameter(gl.RENDERBUFFER_BINDING))._name : null);
	myInfo.main.framebufferstatus = "FRAME BUFFER STATUS:"+gl[gl.checkFramebufferStatus(gl.FRAMEBUFFER)];

//::::::::::::::::::::::::: frame buffer ::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	myFBOs.shadow.inactivate();
//	myTextures.member["screen"].import(myFBOs.shadow.textureColorBuffer);
	myTextures.member["screen"].import(myFBOs.shadow.textureDepthBuffer);

//:::::::::::::::::::: draw frame buffer on clipping space on screen ::::::::::::::::::::::::::


	gl.disable(gl.BLEND);
//	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);//テクスチャの黒は透過
//	gl.blendFunc(gl.ONE_MINUS_DST_ALPHA,gl.DST_ALPHA);

	gl.enable(gl.DEPTH_TEST);
	gl.disable(gl.DEPTH_TEST);
	gl.disable(gl.STENCIL_TEST);

	//https://qiita.com/ienaga/items/3263a752da3287a6c4b6
//	myShaders.drawTextureOnClipSpace.activate();
	myShaders.drawTextureDepthBufferOnClipSpace.activate();
		/** To vertex shader **/
		myShaders.drawTextureDepthBufferOnClipSpace.attrib.aVertexPosition.assignArray([1,1,-1,1,1,-1,-1,-1],2);//four points of each corners of clip space
		myShaders.drawTextureDepthBufferOnClipSpace.uniform.uSampler.sendInt(0);//gl.TEXTURE0<---variable if you prepared another texture as gl.TEXTURE1, you can use it by setting uSampler as 1.
		myTextures.member["screen"].activate();
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	
//:::::::::::::::::::::::::::::::::: GLSL STATUS ::::::::::::::::::::::::::::::::::::::::::

	myInfo.main.glerror = "GL error:"+gl[gl.getError()];
//●	myInfo.main.glstatus = "GL status:"+gl[gl.getParameter(gl.FRAGMENT_SHADER_DERIVATIVE_HINT)];


//*********************************** END *****************************************************

/** the way to use more Textures at once **/
/*
//pass image into gl.TEXTURE[\d+] 
activeTexture(gl.TEXTURE0);
bindTexture(gl.TEXTURE_2D,image0);
activeTexture(gl.TEXTURE0 + 1);
bindTexture(gl.TEXTURE_2D,image1);
//pass into uSampler
locSampler1 = gl.getUniformLocation(prog,"uSampler1");
locSampler2 = gl.getUniformLocation(prog,"uSampler2");
gl.uniform1i(locSampler1,0);
gl.uniform1i(locSampler2,1);
//definition in shader
uniform sampler2D uSampler1;<--image0
uniform sampler2D uSampler2;<--image1
*/
};









//*************************************** START ****************************************************************	








//:start
function start(){

	/** write information on sub screen **/

	myInfo.create("main",550,0);//ordinary writing with properties of '.info=','.caution=' or '.error='

	myInfo.main.createLine("span","black","white",10);//changable line writing with property of its name (e.g. myInfo.main.span="your text";)
	myInfo.main.createLine("glstatus","black","white",10);
	myInfo.main.createLine("glerror","black","white",10);
	myInfo.main.createLine("framebufferstatus","black","white",10);
	myInfo.main.createLine("framebuffer","black","white",10);
	myInfo.main.createLine("renderbuffer","black","white",10);
	myInfo.main.createLine("stencilfunc","black","white",10);
	myInfo.main.createLine("stencilwritemask","black","white",10);
	myInfo.main.createLine("stencilbackwritemask","black","white",10);
	myInfo.main.createLine("stencilbits","black","white",10);
	myInfo.main.createLine("colorbufferattach","black","white",10);
	myInfo.main.createLine("depthbufferattach","black","white",10);
	myInfo.main.createLine("stencilbufferattach","black","white",10);


	

	//** prepare gl canvas **//
	var canvas = document.getElementById('glcanvas');
	canvas.width=canvas.clientWidth;//necessary
	canvas.height=canvas.clientHeight;//necessary
//	var gl=canvas.getContext("webgl2",{premultipliedAlpha:false});https://stackoverflow.com/questions/47216022/webgl-gl-fragcolor-alpha-behave-differently-in-chrome-with-firefox
//	var gl=canvas.getContext("webgl2",{stencil:true});//https://wgld.org/d/webgl/w038.html
//	var gl=canvas.getContext("webgl2",{antialias:true});//http://d.hatena.ne.jp/nakamura001/20120201/1328105898
//	var gl=canvas.getContext("webgl2",{preserveDrawingBuffer:false});//do not know how to use???//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
	var gl=canvas.getContext("webgl2");
//	var gl=canvas.getContext("webgl");
	if(!gl){
		alert('Unable to initialize WebGL.Your browser or machine may not support it.');
		return;
	}
	ext = gl.getExtension('WEBGL_depth_texture');//available in webgl1 ,in webgl2 this is default functionality
	gl._WEBGL_depth_texture = ext;
	console.log("enabled extensions");
	var exts = gl.getSupportedExtensions();
	for(var ii in exts){
		console.log(exts[ii]);
	}
	gl[gl.FASTEST]="FAST";
	gl[gl.NICEST]="NICEST";
	gl[gl.DONT_CARE]="OK";
	gl[gl.NO_ERROR]="NONE";
	gl[gl.INVALID_ENUM]="INVALID ENUM";
	gl[gl.INVALID_VALUE]="INVALID VALUE";
	gl[gl.INVALID_OPERATION]="INVALID OPERATION";
	gl[gl.INVALID_FRAMEBUFFER_OPERATION]="INVALID FRAMEBUFFER OPERATION";
	gl[gl.OUT_OF_MEMORY]="OUT OF MEMORY";
	gl[gl.CONTEXT_LOST_WEBGL]="CONTEXT LOST WEBGL";
	/** checkFramebufferStatus() **/
	gl[gl.FRAMEBUFFER_COMPLETE]="READY";
	gl[gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT]="INCOMPLETE";
	gl[gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT]="INCOMPLETE ATTACHMENT";
	gl[gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS]="INCOMPLETE DIMENSIONS";
	gl[gl.FRAMEBUFFER_UNSUPPORTED]="UNSUPPORTED";
	gl[gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE]="INCOMPLETE MULTI SAMPLE";
	gl[gl.NEVER]="NEVER";
	gl[gl.LESS]="LESS";
	gl[gl.EQUAL]="EQUAL";
	gl[gl.LEQUAL]="LEQUAL";
	gl[gl.GREATER]="GREATER";
	gl[gl.NOTEQUAL]="NOT EQUAL";
	gl[gl.GEQUAL]="GEQUAL";
	gl[gl.ALWAYS]="ALWAYS";
	/** blend gl.blendEquation() **/
	gl[gl.FUNC_ADD]="BLEND_ADD";
	gl[gl.FUNC_SUBTRACT]="BLEND_SUBSTRACT";
	gl[gl.FUNC_REVERSE_SUBTRACT]="BLEND_REVERSE_SUBSTRUCT";
//	gl[]="";

console.log("gl=",gl);


	gl.viewport(0,0,gl.canvas.width,gl.canvas.height);//(kkk bad)クリップ空間の-1～1の値をcanvasの大きさに変換する

//console.log("viewport:",gl.canvas.width,gl.canvas.height);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);	//Clear to black,fully opaque
//	gl.clearColor(1.0, 1.0, 1.0, 1.0);	//White out

{
//	//https://stackoverflow.com/questions/47216022/webgl-gl-fragcolor-alpha-behave-differently-in-chrome-with-firefox
//	//i've been thanking David Guan
//	gl.enable(gl.BLEND);
//	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
};
{
//	//not available
//	//https://stackoverflow.com/questions/24499321/using-gl-fragdepth-in-webgl
//	//https://www.khronos.org/registry/webgl/sdk/tests/conformance/extensions/ext-frag-depth.html
//	gl.getExtension("EXT_frag_depth");
//	if(gl.getSupportedExtensions().indexOf("EXT_frag_depth") >= 0){
//		PRINT_CAUTION.innerHTML+="you CAN use extention gl_FragDepth in frag-shader<br>";
//	}else{
//		PRINT_CAUTION.innerHTML+="you CAN'T use extention gl_FragDepth in frag-shader<br>";
//	}
};

	//** rectangle test **
	//{
	//	gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);
	//    gl.enable(gl.SCISSOR_TEST);
	//   gl.scissor(30, 10, 60, 60);//60x60の正方形
	//    gl.clearColor(1.0, 1.0, 0.0, 1.0);
	//    gl.clear(gl.COLOR_BUFFER_BIT);
	//};

	//** prepare shaders and variables in it **/
	myShaders.create("ringshadow","ringshadowVertexShader","ringshadowFragmentShader",gl);
		myShaders.ringshadow.getAttribLocation("aVertexPosition");
		myShaders.ringshadow.getAttribLocation("aTextureCoord");
		myShaders.ringshadow.getUniformLocation("uSampler");
		myShaders.ringshadow.getUniformLocation("uModelViewMatrixInversedTransposed");
		myShaders.ringshadow.getUniformLocation("uModelViewMatrix");
		myShaders.ringshadow.getUniformLocation("uPerspectiveMatrix");

		myShaders.ringshadow.getUniformLocation("uManipulatedMatrix");

	myShaders.create("light","lightVertexShader","lightFragmentShader",gl);
		myShaders.light.getAttribLocation("aVertexPosition");
	//	myShaders.light.getAttribLocation("aVertexNormal");
		myShaders.light.getAttribLocation("aVertexColor");
	//	myShaders.light.getAttribLocation("aTextureCoord");
	//	myShaders.light.getUniformLocation("uPerspectiveMatrix");
	//	myShaders.light.getUniformLocation("uModelViewMatrix");
	//	myShaders.light.getUniformLocation("uPointSizeFloat");
	//	myShaders.light.getUniformLocation("uSampler");
	//	myShaders.light.getUniformLocation("uModelViewMatrixInversedTransposed");
	//	myShaders.light.getUniformLocation("uBaseLight");
	//	myShaders.light.getUniformLocation("uManipulatedRotationMatrix");
	//	myShaders.light.getUniformLocation("uBrightness");
	//	myShaders.light.getUniformLocation("uAlpha");
	//	myShaders.light.getUniformLocation("uCassiniFactor");
	//	myShaders.light.getUniformLocation("uManipulatedMatrix");
		myShaders.light.getUniformLocation("uOrthographicMatrix");
		myShaders.light.getUniformLocation("uNotManipulatedMatrix");
	myShaders.create("camera","shader-vs","shader-fs",gl);
		myShaders.camera.activate();//there this is 'cause for clear vertex buffers probably.
		myShaders.camera.getAttribLocation("aVertexPosition");
		myShaders.camera.getAttribLocation("aVertexNormal");
		myShaders.camera.getAttribLocation("aVertexColor");
		myShaders.camera.getAttribLocation("aTextureCoord");
		myShaders.camera.getUniformLocation("uPerspectiveMatrix");
		myShaders.camera.getUniformLocation("uModelViewMatrix");
		myShaders.camera.getUniformLocation("uPointSizeFloat");
		myShaders.camera.getUniformLocation("uSampler");
		myShaders.camera.getUniformLocation("uModelViewMatrixInversedTransposed");
		myShaders.camera.getUniformLocation("uBaseLight");
//		myShaders.camera.getUniformLocation("uManipulatedRotationMatrix");
		myShaders.camera.getUniformLocation("uBrightness");
		myShaders.camera.getUniformLocation("uAlpha");
		myShaders.camera.getUniformLocation("uCassiniFactor");
		myShaders.camera.getUniformLocation("uManipulatedMatrix");
	myShaders.create("drawTextureOnClipSpace","drawTextureOnClipSpace-vs","drawTextureOnClipSpace-fs",gl);
		myShaders.drawTextureOnClipSpace.getAttribLocation("aVertexPosition");
		myShaders.drawTextureOnClipSpace.getUniformLocation("uSampler");
	myShaders.create("drawTextureOnClipSpaceWithMakingBlackPartTransparentPart","drawTextureOnClipSpaceWithMakingBlackPartTransparentPart-vs","drawTextureOnClipSpaceWithMakingBlackPartTransparentPart-fs",gl);
		myShaders.drawTextureOnClipSpaceWithMakingBlackPartTransparentPart.getAttribLocation("aVertexPosition");
		myShaders.drawTextureOnClipSpaceWithMakingBlackPartTransparentPart.getUniformLocation("uSampler");
	myShaders.create("drawTextureDepthBufferOnClipSpace","drawTextureDepthBufferOnClipSpace-vs","drawTextureDepthBufferOnClipSpace-fs",gl);
		myShaders.drawTextureDepthBufferOnClipSpace.getAttribLocation("aVertexPosition");
		myShaders.drawTextureDepthBufferOnClipSpace.getUniformLocation("uSampler");

	var nn = gl.getProgramParameter(gl.getParameter(gl.CURRENT_PROGRAM),gl.ACTIVE_ATTRIBUTES);if(nn!=null)for(var ii=0;ii<nn;ii++){gl.disableVertexAttribArray(ii);};


	/** prepare frame buffer & render buffer **/
	var wide = 512;
	myFBOs.create("shadow",gl,wide,wide,wide,wide);//16384<-----MAX_RENDER_SIZE
	myInfo.main.info = "max render buffer size ="+gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);






	//** prepare textures **
	myInfo.main.info = "max texture size ="+gl.MAX_TEXTURE_SIZE;flagMaxTexture=true;
	var nameTextureSun = "sun";
	myTextures.join(gl,nameTextureSun);
	var nameTextureBase = "earth";
	myTextures.join(gl,nameTextureBase);
	var nameTextureMoon = "moon";
	myTextures.join(gl,nameTextureMoon);
	var nameTextureJupiter = "jupiter";
	myTextures.join(gl,nameTextureJupiter);
	var nameTextureUranus = "uranus";
	myTextures.join(gl,nameTextureUranus);
	var nameTextureVenus = "venus";
	myTextures.join(gl,nameTextureVenus);
	var nameTextureMars = "mars";
	myTextures.join(gl,nameTextureMars);
	var nameTextureNeptune = "neptune";
	myTextures.join(gl,nameTextureNeptune);
	var nameTextureMercury = "mercury";
	myTextures.join(gl,nameTextureMercury);
	var nameTextureRing = "ring";
	myTextures.join(gl,nameTextureRing);
	var nameTextureSaturn = "saturn";
	myTextures.join(gl,nameTextureSaturn);
	var nameTextureScreen = "screen";
	myTextures.join(gl,nameTextureScreen);
	var nameTextureObserve = "niku_stand2";
	myTextures.join(gl,nameTextureObserve);
	var nameTextureSaturn2 = "saturn2";
	myTextures.join(gl,nameTextureSaturn2);
	var nameTextureWhite = "white";
	var nameTextureAtomosphere = "white";
//issue	myTextures.create(gl,nameTextureAtomosphere,myColorName.white(0.5));//preserve alpha here
	myTextures.join(gl,nameTextureAtomosphere);




	var _front_=false;
	var _frontLength_ = 60;




	(function(){
		myBall = { };

		/** inner class(closure) **/
		var mag = 0.001;
		var Ball = function(sName,rr){
			this.name = sName;
			this.rr=rr;
		};
		Object.defineProperty(Ball.prototype,'radius',{
			get:function(){return this.rr*mag;},
			set:function(value){this.rr=value;},
			enumerable:true,configurable:false
		});

		/** class **/
		Object.defineProperty(myBall,'join',{value:join,writable:false,enumerable:false,configurable:false});
		function join(sName,radius){
			Object.defineProperty(myBall,sName,{value:new Ball(sName,radius),writable:false,enumerable:true,configurable:false});
		};
	})();

	
	myBall.join("sun",695508);
	myBall.join("jupiter",71492);
	myBall.join("saturn",60268);
	myBall.join("uranus",25559);
//	myBall.join("uranus",125559);
	myBall.join("neptune",24764);
	myBall.join("earth",6378);
	myBall.join("venus",6051);
	myBall.join("mars",3396);
	myBall.join("mercury",2439);
	myBall.join("moon",1738);
	myBall.join("pluto",1195);




	/** common **/
	var brightnessCommon = 1.0;
	var brightnessAtomosphere = 1.0;
	var brightnessSun = 1.1;
	var alphaCommon = 1.0;
	var alphaAtomosphere = 0.3;
	var alphaRing = 0.6;

	var cassiniFactorCommon = 0.0;
	var cassiniFactorRing = 1.0;

	var baseLight = 0.0;
	var baseLightSun = 1.0;

	var colorNameText = myColorName.white(0.5);

	var aMatricesNotManipulatedCommon = [];


		//plane
	var xyzCenter = myXYZManipulation.createMember();
	var aAccumeUnits = [];
//	if(_front_){
	if(true){
		aAccumeUnits.push(AccumeMotions.translate(0,0,-20));
		var labels = new myClass.Labels();
		labels.addText(0,-1,0,"ship",colorNameText);
	} else {
		aAccumeUnits.push(AccumeMotions.translate(0,0,10));
		var labels = new myClass.Labels();
		labels.addText(0,-5,0,"",colorNameText);
	};
	var shape = myGLShape.hexa(gl);
	UnitsToDraw.join(gl,"plane",shape,aAccumeUnits,labels,nameTextureBase,[],[],brightnessCommon,alphaCommon,baseLight,cassiniFactorCommon,aMatricesNotManipulatedCommon);




	/** for Sun **/
	var aAccumeLightingDirectionalSun = [];
	aAccumeLightingDirectionalSun.push(AccumeMotions.gotoOrigin());
	var aAccumeLightingPointSun = [];
	aAccumeLightingPointSun.push(AccumeMotionsXYZ.replaceView(xyzCenter));


		//Sun
	var r = myBall.sun.radius;
//	var xyzSun = myXYZTrigonometry.createMember();
	var aAccumeUnits = [];
	aAccumeUnits.push(AccumeMotions.rotate(1,0,0,0,90));
	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,0.01,0));

//	aAccumeUnits.push(AccumeMotionsXYZ.trans(xyzSun));//revolution公転
	aAccumeUnits.push(AccumeMotionsXYZ.replaceView(xyzCenter));

	if(_front_)aAccumeUnits.push(AccumeMotions.translate(0,0,-_frontLength_));
						//	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,    1,-1,0));
						//	aAccumeUnits.push(AccumeMotions.translate(0,0,-50));//center : sun
						//	aAccumeUnits.push(AccumeMotions.none());
	var labels = new myClass.Labels();
	labels.addText(0,-5,0,"Sun",colorNameText);
//	var shape = myGLShape.hexa(gl);
	var shape = myGLShape.sphere(gl,r);
	UnitsToDraw.join(gl,"sun",shape,aAccumeUnits,labels,nameTextureSun,aAccumeLightingDirectionalSun,aAccumeLightingPointSun,brightnessSun,alphaCommon,baseLightSun,cassiniFactorCommon,aMatricesNotManipulatedCommon);

	/** common **/
	var aAccumeLightingDirectional = [];
	aAccumeLightingDirectional.push(AccumeMotionsXYZ.replaceViewNotTrans(xyzCenter));
	var aAccumeLightingPoint = [];
	aAccumeLightingPoint.push(AccumeMotionsXYZ.replaceView(xyzCenter));

		//Earth
	var r = myBall.earth.radius;
	var xyzEarth = myXYZTrigonometry.createMember();
	var aAccumeUnits = [];
	aAccumeUnits.push(AccumeMotions.rotate(1,0,0,0,90));
	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,1,0));

	aAccumeUnits.push(AccumeMotionsXYZ.trans(xyzEarth));//revolution公転
	aAccumeUnits.push(AccumeMotionsXYZ.replaceView(xyzCenter));

	if(_front_)aAccumeUnits.push(AccumeMotions.translate(0,0,-_frontLength_));
						//	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,    1,-1,0));
						//	aAccumeUnits.push(AccumeMotions.translate(0,0,-50));//center : sun
						//	aAccumeUnits.push(AccumeMotions.none());
	var labels = new myClass.Labels();
	labels.addText(0,-5,0,"Earth",colorNameText);
//	var shape = myGLShape.hexa(gl);
	var shape = myGLShape.sphere(gl,r);
	UnitsToDraw.join(gl,"earth",shape,aAccumeUnits,labels,nameTextureBase,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLight,cassiniFactorCommon,aMatricesNotManipulatedCommon);



	/** Atomosphere of Earth **/
/*
	//not texture but color
	var r = myBall.earth.radius*1.05;
	var xyz = myXYZTrigonometry.createMember();
	var aAccumeUnits = [];
	aAccumeUnits.push(AccumeMotions.rotate(1,0,0,0,90));
	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,1,0));
//	aAccumeUnits.push(AccumeMotionsXYZ.trans(xyzEarth));//revolution公転
//	aAccumeUnits.push(AccumeMotionsXYZ.replaceView(xyzCenter));
	if(_front_)aAccumeUnits.push(AccumeMotions.translate(0,0,-_frontLength_));
						//	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,    1,-1,0));
						//	aAccumeUnits.push(AccumeMotions.translate(0,0,-50));//center : sun
						//	aAccumeUnits.push(AccumeMotions.none());
	var labels = new myClass.Labels();
	labels.addText(0,-5,0,"",colorNameText);
//	var shape = myGLShape.hexa(gl);
	var shape = myGLShape.sphere(gl,r);
	UnitsToDraw.join(gl,"atmosphere",shape,aAccumeUnits,labels,nameTextureAtomosphere,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessAtomosphere,alphaAtomosphere);


*/


	/** Jupiter **/
	var r = myBall.jupiter.radius;
	var xyz = myXYZTrigonometry.createMember();
	var aAccumeUnits = [];
	aAccumeUnits.push(AccumeMotions.rotate(1,0,0,0,90));//rotation自転
	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,1,0));//rotation自転
	aAccumeUnits.push(AccumeMotionsXYZ.trans(xyz));//revolution公転
	aAccumeUnits.push(AccumeMotionsXYZ.replaceView(xyzCenter));
	var aMatricesNotManipulatedJupiter = [];
	aMatricesNotManipulatedJupiter.push(AccumeMotions.rotate(1,0,0,0,90));//rotation自転
	aMatricesNotManipulatedJupiter.push(AccumeMotions.rotate(0,1,0,1,0));//rotation自転
	aMatricesNotManipulatedJupiter.push(AccumeMotionsXYZ.trans(xyz));//revolution公転
	if(_front_)aAccumeUnits.push(AccumeMotions.translate(0,0,-_frontLength_));//seen from the distance
						//	aAccumeUnits.push(AccumeMotions.axisY(1));
						//	aAccumeUnits.push(AccumeMotions.translate(0,0,-50));
						//	aAccumeUnits.push(AccumeMotions.none());
	var labels = new myClass.Labels();
	labels.addText(0,0,0,"Jupitor",colorNameText);//kkk
	var shape = myGLShape.sphere(gl,r);
	UnitsToDraw.join(gl,"jupiter",shape,aAccumeUnits,labels,nameTextureJupiter,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLight,cassiniFactorCommon,aMatricesNotManipulatedJupiter);


	var aMatricesNotManipulatedCommon = [];
	aMatricesNotManipulatedCommon.push(AccumeMotions.rotate(1,0,0,0,90));
	aMatricesNotManipulatedCommon.push(AccumeMotions.rotate(0,1,0,1,0));
	aMatricesNotManipulatedCommon.push(AccumeMotionsXYZ.trans(xyz));


	/** Moon **/
	var r = myBall.moon.radius;
	var xyz = myXYZTrigonometry.createMember();
	var aAccumeUnits = [];
	aAccumeUnits.push(AccumeMotions.rotate(1,0,0,0,90));//rotation自転
	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,1,0));//rotation自転
	aAccumeUnits.push(AccumeMotionsXYZ.trans(xyz));//revolution公転
	aAccumeUnits.push(AccumeMotionsXYZ.replaceView(xyzCenter));
	if(_front_)aAccumeUnits.push(AccumeMotions.translate(0,0,-_frontLength_));//seen from the distance
						//	aAccumeUnits.push(AccumeMotions.axisY(1));
						//	aAccumeUnits.push(AccumeMotions.translate(0,0,-50));
						//	aAccumeUnits.push(AccumeMotions.none());
	var labels = new myClass.Labels();
	labels.addText(0,0,0,nameTextureMoon,colorNameText);//kkk
	var shape = myGLShape.sphere(gl,r);
	UnitsToDraw.join(gl,"moon",shape,aAccumeUnits,labels,nameTextureMoon,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLight,cassiniFactorCommon,aMatricesNotManipulatedCommon);


	/** Uranus **/
	var r = myBall.uranus.radius;
	var xyz = myXYZTrigonometry.createMember();
	var aAccumeUnits = [];
	aAccumeUnits.push(AccumeMotions.rotate(1,0,0,0,90));//rotation自転
	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,1,0));//rotation自転
	aAccumeUnits.push(AccumeMotionsXYZ.trans(xyz));//revolution公転
	aAccumeUnits.push(AccumeMotionsXYZ.replaceView(xyzCenter));
	if(_front_)aAccumeUnits.push(AccumeMotions.translate(0,0,-_frontLength_));//seen from the distance
						//	aAccumeUnits.push(AccumeMotions.axisY(1));
						//	aAccumeUnits.push(AccumeMotions.translate(0,0,-50));
						//	aAccumeUnits.push(AccumeMotions.none());
	var labels = new myClass.Labels();
	labels.addText(0,0,0,nameTextureUranus,colorNameText);//kkk
	var shape = myGLShape.sphere(gl,r);
	UnitsToDraw.join(gl,"uranus",shape,aAccumeUnits,labels,nameTextureUranus,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLight,cassiniFactorCommon,aMatricesNotManipulatedCommon);


	/** Venus **/
	var r = myBall.venus.radius;
	var xyz = myXYZTrigonometry.createMember();
	var aAccumeUnits = [];
	aAccumeUnits.push(AccumeMotions.rotate(1,0,0,0,90));//rotation自転
	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,1,0));//rotation自転
	aAccumeUnits.push(AccumeMotionsXYZ.trans(xyz));//revolution公転
	aAccumeUnits.push(AccumeMotionsXYZ.replaceView(xyzCenter));
	if(_front_)aAccumeUnits.push(AccumeMotions.translate(0,0,-_frontLength_));//seen from the distance
						//	aAccumeUnits.push(AccumeMotions.axisY(1));
						//	aAccumeUnits.push(AccumeMotions.translate(0,0,-50));
						//	aAccumeUnits.push(AccumeMotions.none());
	var labels = new myClass.Labels();
	labels.addText(0,0,0,nameTextureVenus,colorNameText);//kkk
	var shape = myGLShape.sphere(gl,r);
	UnitsToDraw.join(gl,"venus",shape,aAccumeUnits,labels,nameTextureVenus,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLight,cassiniFactorCommon,aMatricesNotManipulatedCommon);


	/** Mars **/
	var r = myBall.mars.radius;
	var xyz = myXYZTrigonometry.createMember();
	var aAccumeUnits = [];
	aAccumeUnits.push(AccumeMotions.rotate(1,0,0,0,90));//rotation自転
	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,1,0));//rotation自転
	aAccumeUnits.push(AccumeMotionsXYZ.trans(xyz));//revolution公転
	aAccumeUnits.push(AccumeMotionsXYZ.replaceView(xyzCenter));
	if(_front_)aAccumeUnits.push(AccumeMotions.translate(0,0,-_frontLength_));//seen from the distance
						//	aAccumeUnits.push(AccumeMotions.axisY(1));
						//	aAccumeUnits.push(AccumeMotions.translate(0,0,-50));
						//	aAccumeUnits.push(AccumeMotions.none());
	var labels = new myClass.Labels();
	labels.addText(0,0,0,nameTextureMars,colorNameText);//kkk
	var shape = myGLShape.sphere(gl,r);
	UnitsToDraw.join(gl,"mars",shape,aAccumeUnits,labels,nameTextureMars,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLight,cassiniFactorCommon,aMatricesNotManipulatedCommon);


	/** Neptune **/
	var r = myBall.neptune.radius;
	var xyz = myXYZTrigonometry.createMember();
	var aAccumeUnits = [];
	aAccumeUnits.push(AccumeMotions.rotate(1,0,0,0,90));//rotation自転
	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,1,0));//rotation自転
	aAccumeUnits.push(AccumeMotionsXYZ.trans(xyz));//revolution公転
	aAccumeUnits.push(AccumeMotionsXYZ.replaceView(xyzCenter));
	if(_front_)aAccumeUnits.push(AccumeMotions.translate(0,0,-_frontLength_));//seen from the distance
						//	aAccumeUnits.push(AccumeMotions.axisY(1));
						//	aAccumeUnits.push(AccumeMotions.translate(0,0,-50));
						//	aAccumeUnits.push(AccumeMotions.none());
	var labels = new myClass.Labels();
	labels.addText(0,0,0,nameTextureNeptune,colorNameText);//kkk
	var shape = myGLShape.sphere(gl,r);
	UnitsToDraw.join(gl,"neptune",shape,aAccumeUnits,labels,nameTextureNeptune,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLight,cassiniFactorCommon,aMatricesNotManipulatedCommon);


	/** Mercury **/
	var r = myBall.mercury.radius;
	var xyz = myXYZTrigonometry.createMember();
	var aAccumeUnits = [];
	aAccumeUnits.push(AccumeMotions.rotate(1,0,0,0,90));//rotation自転
	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,1,0));//rotation自転
	aAccumeUnits.push(AccumeMotionsXYZ.trans(xyz));//revolution公転
	aAccumeUnits.push(AccumeMotionsXYZ.replaceView(xyzCenter));
	if(_front_)aAccumeUnits.push(AccumeMotions.translate(0,0,-_frontLength_));//seen from the distance
						//	aAccumeUnits.push(AccumeMotions.axisY(1));
						//	aAccumeUnits.push(AccumeMotions.translate(0,0,-50));
						//	aAccumeUnits.push(AccumeMotions.none());
	var labels = new myClass.Labels();
	labels.addText(0,0,0,nameTextureMercury,colorNameText);//kkk
	var shape = myGLShape.sphere(gl,r);
	UnitsToDraw.join(gl,"mercury",shape,aAccumeUnits,labels,nameTextureMercury,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLight,cassiniFactorCommon,aMatricesNotManipulatedCommon);





//AccumeMotions-------> myMotionsOnce
//AccumeMotionsXYZ ---> myMotionsContinuous


	/** Saturn **/
	var r = myBall.saturn.radius;
	var xyzSaturn = myXYZTrigonometry.createMember();
	var aAccumeUnitsSaturn = [];
	aAccumeUnitsSaturn.push(AccumeMotions.rotate(1,0,0,0,90));//rotation自転
	aAccumeUnitsSaturn.push(AccumeMotions.rotate(0,1,0,1,0));//rotation自転
	aAccumeUnitsSaturn.push(AccumeMotionsXYZ.trans(xyzSaturn));//revolution公転
	aAccumeUnitsSaturn.push(AccumeMotionsXYZ.replaceView(xyzCenter));
	if(_front_)aAccumeUnitsSaturn.push(AccumeMotions.translate(0,0,-_frontLength_));//seen from the distance
						//	aAccumeUnitsSaturn.push(AccumeMotions.axisY(1));
						//	aAccumeUnitsSaturn.push(AccumeMotions.translate(0,0,-50));
						//	aAccumeUnitsSaturn.push(AccumeMotions.none());

	var aMatricesNotManipulatedSaturn = [];
	aMatricesNotManipulatedSaturn.push(AccumeMotions.rotate(1,0,0,0,90));//rotation自転
	aMatricesNotManipulatedSaturn.push(AccumeMotions.rotate(0,1,0,1,0));//rotation自転
	aMatricesNotManipulatedSaturn.push(AccumeMotionsXYZ.trans(xyzSaturn));//revolution公転

	var labels = new myClass.Labels();
	labels.addText(0,0,0,nameTextureSaturn,colorNameText);//kkk
	var shape = myGLShape.sphere(gl,r);
	UnitsToDraw.join(gl,"saturn",shape,aAccumeUnitsSaturn,labels,nameTextureSaturn,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLight,cassiniFactorCommon,aMatricesNotManipulatedSaturn);

	/** Ring **/
	var rOut = myBall.saturn.radius*2.327;
	var rIn = myBall.saturn.radius*1.116086;
	var aAccumeUnitsRing = aAccumeUnitsSaturn;
	var aMatricesNotManipulatedRing = aMatricesNotManipulatedSaturn;
	var labels = new myClass.Labels();
	labels.addText(0,0,0,"",colorNameText);//kkk
	var shape = myGLShape.ring(gl,rIn,rOut);
	UnitsToDraw.join(gl,"ring",shape,aAccumeUnitsRing,labels,nameTextureRing,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaRing,baseLightSun,cassiniFactorRing,aMatricesNotManipulatedRing);


	/** Saturn2 **/
	var r = myBall.saturn.radius;
	var shape = myGLShape.sphere(gl,r);
	UnitsToDraw.join(gl,"saturn2",shape,aAccumeUnitsSaturn,labels,nameTextureSaturn2,[],aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLight,cassiniFactorCommon,aMatricesNotManipulatedSaturn);
//	UnitsToDraw.join(gl,"saturn2",shape,aAccumeUnitsSaturn,labels,nameTextureSaturn,[],aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLight,cassiniFactorCommon,aMatricesNotManipulatedSaturn);



	/** satellite thrown in various random directions **/
/*
	for(var hh=0;hh<10;hh++){
		var r = myBall.moon.radius;
		var xyz = myXYZTrigonometry.createMember();
		var aAccumeUnits = [];
		aAccumeUnits.push(AccumeMotions.rotate(0,1,0,1,0));//rotation自転
			aAccumeUnits.push(AccumeMotionsXYZ.trans(xyz));//revolution公転
			aAccumeUnits.push(AccumeMotionsXYZ.replaceView(xyzCenter));
			if(_front_)aAccumeUnits.push(AccumeMotions.translate(0,0,-_frontLength_));//seen from the distance
							//	aAccumeUnits.push(AccumeMotions.axisY(1));
							//	aAccumeUnits.push(AccumeMotions.translate(0,0,-50));
							//	aAccumeUnits.push(AccumeMotions.none());
		var labels = new myClass.Labels();
		labels.addText(0,0,0,hh.toString(),colorNameText);//kkk
		var shape = myGLShape.sphere(gl,r);
		UnitsToDraw.join(gl,"st"+hh.toString(),shape,aAccumeUnits,labels,nameTextureAsteroid,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLight,cassiniFactorCommon,aMatricesNotManipulatedCommon);
	};

*/


	/* These two kinds of objects below must always be lit from right(90 degree) angle ,so that they are lighten most brightly*/
	/* In other words,they must be always lit brightly.(e.g. indicater , axes and so on) */
	/** common **/
	var aAccumeLightingDirectional = [];
	aAccumeLightingDirectional.push(AccumeMotions.translate(1.0,1.0,1.0));//Light is put at (1 1 1)
	aAccumeLightingDirectional.push(AccumeMotionsXYZ.replaceViewNotTrans(xyzCenter));//always (1 1 1) as same relationship of positionning
	aAccumeLightingPoint = [];

	//stars far from planet
/*
	var spread=100;
	var p1,r1,t1;
	for(var hh=0;hh<100;hh++){
		var aAccumeUnits=[];
		aAccumeUnits.push(AccumeMotionsXYZ.replaceView(xyzCenter));
		if(_front_)aAccumeUnits.push(AccumeMotions.translate(0,0,-_frontLength_));
		var labels = new myClass.Labels();
		//labels.addText(0,0,-10,"hexa",colorNameText);
		r1 = 1000*Math.random()+1000;
		t1 = 3.141592653*2*Math.random();
		t2 = 3.141592653*Math.random()-1.5707963265;
		r2 = r1*Math.cos(t2);
		p1 = new myClass.Point(r2*Math.cos(t1),r2*Math.sin(t1),r1*Math.sin(t2));
		var shape = myGLShape.point(gl,p1,myColorName.purple(1));
		UnitsToDraw.join(gl,"star"+hh.toString(),shape,aAccumeUnits,labels,nameTextureBase,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLight,cassiniFactorCommon,aMatricesNotManipulatedCommon);
	}
*/

	/** x,y,z axes **/

	var aAccumeUnits = [];
	aAccumeUnits.push(AccumeMotionsXYZ.replaceViewNotTrans(xyzCenter));
	aAccumeUnits.push(AccumeMotions.translate(-15,-15,-30));
	var labels = new myClass.Labels();
	labels.addText(0,0,5,"back",colorNameText);
	var shape = myGLShape.line(gl,new myClass.Point(0,0,0),new myClass.Point(0,0,5),myColorName.magenta(1));
		UnitsToDraw.join(gl,"back",shape,aAccumeUnits,labels,nameTextureWhite,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLightSun,cassiniFactorCommon,aMatricesNotManipulatedCommon);
	var labels = new myClass.Labels();
	labels.addText(0,5,0,"up",colorNameText);
	var shape = myGLShape.line(gl,new myClass.Point(0,0,0),new myClass.Point(0,5,0),myColorName.magenta(1));
		UnitsToDraw.join(gl,"up",shape,aAccumeUnits,labels,nameTextureWhite,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLightSun,cassiniFactorCommon,aMatricesNotManipulatedCommon);
	var labels = new myClass.Labels();
	labels.addText(5,0,0,"right",colorNameText);
	var shape = myGLShape.line(gl,new myClass.Point(0,0,0),new myClass.Point(5,0,0),myColorName.magenta(1));
		UnitsToDraw.join(gl,"right",shape,aAccumeUnits,labels,nameTextureWhite,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLightSun,cassiniFactorCommon,aMatricesNotManipulatedCommon);








	/** observer **/
	var aAccumeUnits = [];
	aAccumeUnits.push(AccumeMotionsXYZ.replaceView(xyzCenter));
	var labels = new myClass.Labels();
	labels.addText(0,0,0,"origin",colorNameText);
//	labels.addText(0,0,0,"origin",colorNameText);
	var shape = myGLShape.triangle(gl,new myClass.Point(0,0,0),new myClass.Point(5,0,-10),new myClass.Point(-5,0,-10),myColorName.magenta(1));
		UnitsToDraw.join(gl,"observer",shape,aAccumeUnits,labels,nameTextureBase,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLightSun,cassiniFactorCommon,aMatricesNotManipulatedCommon);






	/** shadow **/
	var aAccumeUnits = [];
	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,0,90));
	aAccumeUnits.push(AccumeMotionsXYZ.replaceView(xyzCenter));
	var labels = new myClass.Labels();
	labels.addText(0,0,0,"shadow",colorNameText);
//	labels.addText(0,0,0,"origin",colorNameText);
	var shape = myGLShape.cylindricalCalumn(gl,500,500);
		UnitsToDraw.join(gl,"shadow",shape,aAccumeUnits,labels,nameTextureBase,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLightSun,cassiniFactorCommon,aMatricesNotManipulatedCommon);











	/** screen to draw shadow **/

	var aAccumeUnits = [];
	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,0,90));
	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,0,90));
	aAccumeUnits.push(AccumeMotions.rotate(0,0,1,0,180));

//	aAccumeUnits.push(AccumeMotions.rotate(0,1,0,1,0));//rotation自転
//	aAccumeUnits.push(AccumeMotionsXYZ.replaceView(xyzCenter));
	aAccumeUnits.push(AccumeMotions.translate(0,0,-30));//seen from the distance
	var labels = new myClass.Labels();
	labels.addText(0,0,0,"screen",colorNameText);//kkk
	var shape = myGLShape.rectangle(gl,20,20);
	UnitsToDraw.join(gl,"screen",shape,aAccumeUnits,labels,nameTextureScreen,aAccumeLightingDirectional,aAccumeLightingPoint,brightnessCommon,alphaCommon,baseLight,cassiniFactorCommon,aMatricesNotManipulatedCommon);



//********************************************** animation ****************************************************	
	var timeBefore=0;
	var span=0;
	var dt;
	function render(timeStamp){
		dt = timeStamp - timeBefore;
		if(dt>10){
			span+=dt/16;
			myInfo.main.span = "span="+(Math.floor(span)).toString();
			myXYZTrigonometry.reposAll(dt);
			myXYZManipulation.move(dt);
//			drawScene(gl,oShader.camera,span);
			drawScene(gl,span);
			timeBefore = timeStamp;
		}
		window.requestAnimationFrame(render);
	}
	window.requestAnimationFrame(render);
};//start


//**************************** 3D DRAW with MOVING, LIGHTING, TEXTURING, COLORING and so on *************************************************


/* all the things to be wanted to draw must be thrown into 'oModel',e.g. shape or text with its position x,y,z*/
(function(){
	UnitsToDraw = { };
	Object.defineProperty(UnitsToDraw,'join',{value:join,writable:false,enumerable:false,configurable:false});	
	function join(gl,sName,shape,aMotions,aLabels,sNameTexture,aLightDirectionalMotions,aLightPointMotions,brightness,alpha,fBaseLight,fCassiniFactor,aMatricesNotManipulated){
		Object.defineProperty(UnitsToDraw,sName,{value:new ToolBox(gl,sName,shape,aMotions,aLabels,sNameTexture,aLightDirectionalMotions,aLightPointMotions,brightness,alpha,fBaseLight,fCassiniFactor,aMatricesNotManipulated),writable:false,enumerable:true,configurable:false});
	}


	//
	//@param {myGLShape.obj} shape in which there are points,color,normal vector,indeces and so on
	//
	function ToolBox(gl,sName,shape,aMotions,aLabels,sNameTexture,aLightsDirectional,aLightsPoint,brightness,alpha,fBaseLight,fCassiniFactor,aMatricesNotManipulated){//f means float
		this.draw = shape.draw;
		this.buffers = createBuffers(gl,shape,sName);
		this.aAccumeUnits = aMotions;
		this.labels = aLabels;
		this.nameTexture = sNameTexture;

		this.aAccumeUnitsLightDirectional = aLightsDirectional;
		this.aAccumeUnitsLightPoint = aLightsPoint;
		this.brightness = brightness;
		this.alpha = alpha;
		this.baseLight = fBaseLight;

		this.cassiniFactor = fCassiniFactor;
		this.aMatricesNotManipulated=aMatricesNotManipulated;
	};

	/** inner function**/
	function createBuffers(gl,shape,sName){
		//生成したバッファをWebGLBufferにバインドしたら、
		//あとはそれにvertexのattributionをbufferDataを使って
		//頂点の座標、頂点の色、テキストデータなどをバッファに放り込むだけ

		//position to buffer
		var buffPositions = gl.createBuffer();
		buffPositions._name = sName+"-Position:"+shape.name;
		gl.bindBuffer(gl.ARRAY_BUFFER,buffPositions);
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(shape.pos),gl.STATIC_DRAW);

		//normal vectors to buffer//●
		var buffNormal = gl.createBuffer();
		buffNormal._name = sName+"-Normal:"+shape.name;
		gl.bindBuffer(gl.ARRAY_BUFFER,buffNormal);
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(shape.nor),gl.STATIC_DRAW);

		//color to buffer
		var buffColors = gl.createBuffer();//正方形のvertices
		buffColors._name = sName + "-Colors:"+shape.name;
		gl.bindBuffer(gl.ARRAY_BUFFER,buffColors);
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(shape.col),gl.STATIC_DRAW);

		//texture position to buffer
		var buffTextureCoordinate = gl.createBuffer();
		buffTextureCoordinate._name = sName+"-Texturecoord:"+shape.name;
		gl.bindBuffer(gl.ARRAY_BUFFER,buffTextureCoordinate);
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(shape.tex),gl.STATIC_DRAW);

		//indices to ELEMENT buffer
		var buffIndex = gl.createBuffer();
		buffIndex._name = sName + "-Index:"+shape.name;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffIndex);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(shape.ind),gl.STATIC_DRAW);

		return {
			position : buffPositions,
			texture : buffTextureCoordinate,
			normal : buffNormal,
			color : buffColors,
			bindElement : function(){gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffIndex)}
		};
	};



})();//UnitsToDraw

//******************************************** framebuffer & renderBuffer **************************************************
/**
 *make render buffer with frame buffer and texture of void
*/
(function(){
//:myFBOs
	myFBOs = { };
	Object.defineProperty(myFBOs,'create',{value:create,writable:false,enumerable:true,configurable:false});
	function create(sName,gl,tWidth,tHeight,vWidth,vHeight){
		Object.defineProperty(myFBOs,sName,{value:new FBO(gl,tWidth,tHeight,vWidth,vHeight),writable:false,enumerable:true,configurable:true});
	};


	//reference
	//https://wgld.org/d/webgl/w051.html
	//http://www.chinedufn.com/webgl-shadow-mapping-tutorial/
	//https://stackoverflow.com/questions/41824631/how-to-work-with-framebuffers-in-webgl/41832778#41832778
	//http://www.wakayama-u.ac.jp/~tokoi/lecture/gg/ggnote13.pdf
	//http://www.songho.ca/opengl/gl_fbo.html
	/** inner class **/
	  //Texture, Framebuffer and Renderbuffer are necessary at once.
	var FBO = function(gl,tWidth,tHeight,vWidth,vHeight){
		this.gl = gl;

		this.tWidth = tWidth;
		this.tHeight = tHeight;
		this.vWidth = vWidth;//for viewport()
		this.vHeight = vHeight;

		var size = tWidth * tHeight;
		if(size > gl.getParameter(gl.MAX_RENDERBUFFER_SIZE))myInfo.main.caution = "framebuffer size is too large "+size;

		this.framebuffer = gl.createFramebuffer();
		this.framebuffer._name = "framebuffer";
		this.renderbuffer = gl.createRenderbuffer();
		this.renderbuffer._name = "renderbuffer";

		this.initialize();
	};
	FBO.prototype.initialize = function(){
		/** prepare texture rendered into **/
		var gl = this.gl;

		this.textureColorBuffer = gl.createTexture();
		this.textureColorBuffer._name = "ColorBufferTexture";
			gl.bindTexture(gl.TEXTURE_2D,this.textureColorBuffer);//-->gl.TEXTURE[?]
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);//kkk
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);//kkk
			gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,this.tWidth,this.tHeight,0,gl.RGBA,gl.UNSIGNED_SHORT_4_4_4_4,null);//pass no image into gl.TEXT[\d+]
		//https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture
		this.textureDepthBuffer = gl.createTexture();
		this.textureDepthBuffer._name = "DepthBufferTexture";
			gl.bindTexture(gl.TEXTURE_2D,this.textureDepthBuffer);//-->gl.TEXTURE[?]
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);//kkk
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);//kkk
			gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH_COMPONENT16,this.tWidth,this.tHeight,0,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,null);//pass no image into gl.TEXT[\d+]
		//https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture
		this.textureStencilBuffer = gl.createTexture();
		this.textureStencilBuffer._name = "StencilBufferTexture";
			gl.bindTexture(gl.TEXTURE_2D,this.textureStencilBuffer);//-->gl.TEXTURE[?]
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);//kkk
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);//kkk
			gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH24_STENCIL8,this.tWidth,this.tHeight,0,gl.DEPTH_STENCIL,gl.UNSIGNED_INT_24_8,null);//pass no image into gl.TEXT[\d+]

		this.colorMasks = void 0;
		this.depthTest = void 0;
		this.stencilTest = void 0;


	};
	FBO.prototype.activate = function(sMode){
		var gl = this.gl;
		gl.viewport(0,0,this.vWidth,this.vHeight);

		//for resetting at the time of inactivation
		this.colorMasks =  gl.getParameter(gl.COLOR_WRITEMASK);
		this.depthTest =   gl.getParameter(gl.DEPTH_TEST);
		this.stencilTest = gl.getParameter(gl.STENCIL_TEST);

//console.log("viewport-FBO:",this.vWidth,this.vHeight);

		gl.bindFramebuffer(gl.FRAMEBUFFER,this.framebuffer);
		var matches,nameBuff;
		matches = sMode.match(/C[NTR]D[NTR]S[NTR]|C[NTR]S[NTR]D[NTR]|D[NTR]C[NTR]S[NTR]|D[NTR]S[NTR]C[NTR]|S[NTR]C[NTR]D[NTR]|S[NTR]D[NTR]C[NTR]/g);
		if(matches == null){
			myInfo.main.error = "FBO.*.activate('HERE') 's HERE is wrong strings";
			return;
		}
		matches = sMode.match(/CR/);
		if(matches != null){
			matches = sMode.match(/DR|SR/);
			if(matches != null){
				myInfo.main.error = "FBO.*.activate('HERE') 's HERE contains CR and, DR, SR or both";
				return;
			}
		}
		matches = sMode.match(/R/);
		if(matches != null){
			gl.bindRenderbuffer(gl.RENDERBUFFER,this.renderbuffer);
		}else{
			gl.bindRenderbuffer(gl.RENDERBUFFER,null);
		}
		nameBuff = "COLOR BUFFER ATTACHING TO :";
		matches = sMode.match(/C(.)/);
		var mode = matches[1];
		switch(mode){
			case "N":
				gl.colorMask(false,false,false,false);
				myInfo.main.colorbufferattach = nameBuff + "None";
				break;
			case "T":
				gl.colorMask(true,true,true,true);
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D, this.textureColorBuffer, 0);
				myInfo.main.colorbufferattach = nameBuff + "Texture";
				break;
			case "R":
				gl.colorMask(true,true,true,true);
				gl.renderbufferStorage(gl.RENDERBUFFER,gl.RGBA4,this.tWidth,this.tHeight);
				gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.RENDERBUFFER,this.renderbuffer);//gl.DEPTH_ATTACHMENT--means-->bit format
				myInfo.main.colorbufferattach = nameBuff + "Renderbuffer";
				break;
			default:
		}
		matches = sMode.match(/DRSR|SRDR|DRC.SR|SRC.DR/g);
		if(matches != null){
			gl.enable(gl.DEPTH_TEST);
			gl.enable(gl.STENCIL_TEST);
			gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_STENCIL,this.tWidth,this.tHeight);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_STENCIL_ATTACHMENT,gl.RENDERBUFFER,this.renderbuffer);
			myInfo.main.depthbufferattach = "  DEPTH BUFFER ATTACHING TO : Renderbuffer";
			myInfo.main.stencilbufferattach = "STENCIL BUFFER ATTACHING TO : Renderbuffer";
			return;//*********** return ***************/
		}
		nameBuff = "DEPTH BUFFER ATTACHING TO : ";
		matches = sMode.match(/D(.)/);
		var mode = matches[1];
		switch(mode){
			case "N":
				gl.disable(gl.DEPTH_TEST);
				myInfo.main.depthbufferattach = nameBuff + "None";
				break;
			case "T":
				gl.enable(gl.DEPTH_TEST);
				//gl.bindTexture(gl.TEXTURE_2D, this.textureDepthBuffer);
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D, this.textureDepthBuffer, 0);
				myInfo.main.depthbufferattach = nameBuff + "Texture";
				break;
			case "R":
				gl.enable(gl.DEPTH_TEST);
				gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,this.tWidth,this.tHeight);
				gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,this.renderbuffer);//gl.DEPTH_ATTACHMENT--means-->bit format
				myInfo.main.depthbufferattach = nameBuff + "Renderbuffer";
				break;
			default:
		}
		nameBuff = "STENCIL BUFFER ATTACHING TO :";
		matches = sMode.match(/S(.)/);
		var mode = matches[1];
		switch(mode){
			case "N":
				gl.disable(gl.STENCIL_TEST);
				myInfo.main.stencilbufferattach = nameBuff + "None";
				break;
			case "T":
				gl.enable(gl.STENCIL_TEST);
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT,gl.TEXTURE_2D, this.textureStencilBuffer, 0);
				myInfo.main.stencilbufferattach = nameBuff + "Texture";
				break;
			case "R":
				gl.enable(gl.STENCIL_TEST);
				gl.renderbufferStorage(gl.RENDERBUFFER,gl.STENCIL_INDEX8,this.tWidth,this.tHeight);
				gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.STENCIL_ATTACHMENT,gl.RENDERBUFFER,this.renderbuffer);//gl.DEPTH_ATTACHMENT--means-->bit format
				myInfo.main.stencilbufferattach = nameBuff + "Renderbuffer";
				break;
			default:
		}
	};
	FBO.prototype.inactivate = function(){
		var gl=this.gl;
		gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
//console.log("viewport-3:",gl.canvas.width,gl.canvas.height);
		gl.bindTexture(gl.TEXTURE_2D,null);
		gl.bindFramebuffer(gl.FRAMEBUFFER,null);
		gl.bindRenderbuffer(gl.RENDERBUFFER,null);

		gl.colorMask(this.colorMasks[0],this.colorMasks[1],this.colorMasks[2],this.colorMasks[3]);
		if(this.depthTest)gl.enable(gl.DEPTH_TEST);
		else gl.disable(gl.DEPTH_TEST);
		if(this.stencilTest)gl.enable(gl.STENCIL_TEST);
		else gl.disable(gl.STENCIL_TEST);
	};
	FBO.prototype.reset = function(){
		//https://github.com/KhronosGroup/WebGL/blob/master/sdk/tests/conformance/rendering/framebuffer-texture-clear.html
		this.gl.deleteTexture(this.textureColorBuffer);
		this.gl.deleteTexture(this.textureDepthBuffer);
		this.gl.deleteTexture(this.textureStencilBuffer);
		this.initialize();
	};
})();

</script>

</head><body style="overflow:hidden;" onload="start();">
<div>
<div id="canvasContainer">
	<canvas id="glcanvas" style="position:relative;top:0px;left:0px;background-color:black;width:512px;height:512px;"></canvas>
</div>
<p id="PRINT_INFO" style="position:absolute;top:0px;left:0px:offset:0px;font-size:40px;background-color:white;"></p>
<p id="PRINT_CAUTION" style="position:absolute;top:0px;left:0px;color:red;font-size:25px;line-height:28px;offset:0px;background-color:transparent;"></p>
	<div>
		<h3 style="offset:0px;">Animating objects with WebGL</h3>
		<h5 style="offset:0px;">using gl.TRIANGLES mode to draw and not using gl.ELEMENT_ARRAY_BUFFER mode to buffer</h5>
		<p class="info" style="position:relative;top:0px;left:0px;color:black;font-size:30px:offset:0px">cite site:<a href="https://developer.mozilla.org/ja/docs/Web/API/WebGL_API/Tutorial/Lighting_in_WebGL">MDN web docs moz://a(click next page)</a></p>
		<p class="info" style="position:relative;top:0px;left:0px;color:black;font-size:30px:offset:0px">cite site:<a href="https://webglfundamentals.org/webgl/lessons/webgl-drawing-multiple-things.html">WebGLFundamentals</a></p>
	</div>
</div></body></html>

