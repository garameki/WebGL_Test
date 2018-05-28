//******************************* TEXTURE ******************************************************


/**
 *for managing texture files and its entity only one object below
*/
(function(){

	var flagMaxTexture = false;
		//reference
		//https://stackoverflow.com/questions/11292599/how-to-use-multiple-textures-in-webgl
		//https://stackoverflow.com/questions/8688600/context-getimagedata-on-localhost
	/** inner class **/
	var Texture = function(gl,sName){
		this.gl = gl;
		this.name = sName;//this is used like this, rootHTTPImages+this.name+".png"
		this.texture = gl.createTexture();
		this.texture._name = sName;
		console.log("myTextures.js:this.texture=",this.texture);
	};
	Texture.prototype.activate = function(num){
		this.gl.activeTexture(this.gl.TEXTURE0 + Number(num));//https://stackoverflow.com/questions/11292599/how-to-use-multiple-textures-in-webgl toji answered
		this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture);
	};

	function nearestGreaterOrEqualPowerOf2(v) {
	  return Math.pow(2, Math.ceil(Math.log2(v)));
	}
	Texture.prototype.read = function(){
		var gl = this.gl;
		var image = new Image();
		var myself = this;
		image.onload = function (){
			var size = image.naturalWidth*image.naturalHeight;
			if(size > Number(gl.getParameter(gl.MAX_TEXTURE_SIZE))){
//				myInfo.main.caution="The size is over  '"+myself.name+"' "+size;
			}
			gl.bindTexture(gl.TEXTURE_2D,myself.texture);
			if(false){
				//https://webglfundamentals.org/webgl/lessons/webgl-2-textures.html
				gl.texParameteri (gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
				gl.texParameteri (gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_NEAREST);//gl.TEXTURE_2Dにbit演算している？gl.ACTIVE_TEXTURE
				gl.texImage2D    (gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
				gl.generateMipmap(gl.TEXTURE_2D);//gl.TEXTURE_2Dをmipmapに適用
			}else{
				//https://stackoverflow.com/questions/46931351/how-to-add-interpolation-using-webgl-vertex-and-fragment-shaders-to-the-image
				const newWidth = nearestGreaterOrEqualPowerOf2(image.width);
				const newHeight = nearestGreaterOrEqualPowerOf2(image.height);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, newWidth, newHeight, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
				gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
				gl.generateMipmap(gl.TEXTURE_2D);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);			//gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);			//gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			}//boolean
		};

		var reader = new FileReader();
		reader.onloadend = function(){
			image.src = reader.result;
		};

		var h = new XMLHttpRequest();//You need local http server if you execute javascript in local host.
		h.responseType = "blob";
		h.onloadend = function(){
			//https://stackoverflow.com/questions/30426277/catch-a-404-error-for-xhr
			if(h.status == 404){
//				myInfo.main.caution="404 error occured in myTextures.js at '"+this.name+"'";

				//---https://webglfundamentals.org/webgl/lessons/webgl-data-textures.html
				//---https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
				//---https://github.com/mrdoob/three.js/issues/386
				var color = myColorName.blue(1.0);
				var pixel = new Uint8Array([color.r,color.g,color.b,color.a,color.r,color.g,color.b,color.a,color.r,color.g,color.b,color.a,color.r,color.g,color.b,color.a]);
				//gl.activeTexture(gl.TEXTURE0);//kkk
				//gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);

console.log("myself.texture=",myself.texture._name);
				gl.bindTexture(gl.TEXTURE_2D,myself.texture);

				gl.texParameteri (gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
				gl.texParameteri (gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_NEAREST);//gl.TEXTURE_2Dにbit演算している？
				gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,2,2,0,gl.RGBA,gl.UNSIGNED_SHORT_4_4_4_4,new Uint16Array(pixel),0);
			}else{
				reader.readAsDataURL(h.response);
			}
		};
		h.open('GET',"http://localhost:8000/"+rootHTTPImages+this.name+".png");
		h.send();
		//To get url data, it's necessary to have been executing two applications listed below
		// ・chrome.exe --disable-web-security --user-data-dir//
		// ・ruby -run -e httpd . -p 8000//The dot '.' means current folda in which exeute ruby command.
		//		And set the variable rootHTTPImages with it
		//the line of Ruby is able to be replaced with other language as python,php or more in order to work as simple http local server.
	};
	Texture.prototype.import = function(texture){
		this.texture = texture;
	};

	
	//textures
	myTextures = { };

	var oTextures = { };
	var rootHTTPImages = "documents/games/3d/";//default

	Object.defineProperty(myTextures,'changeRoot',{value:changeRootForImage,writable:false,enumerable:false,configurable:false});
	function changeRootForImage(sFolda){
		rootHTTPImages = sFolda;
		//code to recognize whether it exists or not
	};

	Object.defineProperty(myTextures,'join',{value:create,writable:false,enumerable:true,configurable:false});
	function create(gl,name){
		var instance = new Texture(gl,name,Object.keys(oTextures).length);
		Object.defineProperty(oTextures,name,{value:instance,writable:false,enumerable:true,configurable:false});
		instance.read();

	};

	Object.defineProperty(myTextures,'member',{get:function(){return oTextures;}});//reference to use myTextures.member['nameOfTexture']

	Object.defineProperty(myTextures,'create',{value:makeColorTexture,writable:false,enumerable:true,configurable:false});
	function makeColorTexture(gl,sName){
		var instance = new Texture(gl,sName);
		Object.defineProperty(oTextures,name,{value:instance,writable:false,enumerable:true,configurable:false});
	};

})();//myTextures





/*	a trivia how to use prentheses () with '||'
// recycling same object
function withValue(value) {
  var d = withValue.d || (
    withValue.d = {
      enumerable: false,
      writable: false,
      configurable: false,
      value: null
    }
  );
  d.value = value;
  return d;
}
// ... and ...
Object.defineProperty(obj, 'key', withValue('static'));
*/


