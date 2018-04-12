//******************************* TEXTURE ******************************************************


/**
 *for managing texture files and its entity only one object below
*/
(function(){

		//cite
		//https://stackoverflow.com/questions/11292599/how-to-use-multiple-textures-in-webgl
	/** inner class **/
	var Texture = function(gl,name,number){
		this.gl = gl;
		this.name = name;//this is used for like this, rootHTTPImages+this.name+".png"
		this.number = number;//texture number
		this.texture = gl.createTexture();
	};
	Texture.prototype.activate = function(){
//		this.gl.activeTexture(this.gl.TEXTURE0);//+this.number);//ここで保存されていればbindしなくて済む
		this.gl.bindTexture   (this.gl.TEXTURE_2D,this.texture);//kkk this.textureとしてアドレスを補完するべきなのか？それともTEXTURE0に保存さててしまうのか？
	};
	Texture.prototype.read = function(){
		var gl = this.gl;
		var image = new Image();
		var myself = this;
		image.onload = function (){
				//gl.TEXT[\d]* must be connected in fragment shader,so when i use only one texture in the shader,it is not necessary for js-script to use gl.TEXTURE0 above.
				//https://webglfundamentals.org/webgl/lessons/webgl-2-textures.html
//●consider-able	gl.activeTexture(gl.TEXTURE0+myself.number);//https://stackoverflow.com/questions/11292599/how-to-use-multiple-textures-in-webgl toji answered
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture   (gl.TEXTURE_2D,myself.texture);//kkk this.textureとしてアドレスを補完するべきなのか？それともTEXTURE0に保存さててしまうのか？
			gl.texImage2D    (gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
			gl.texParameteri (gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
			gl.texParameteri (gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_NEAREST);//gl.TEXTURE_2Dにbit演算している？
			gl.generateMipmap(gl.TEXTURE_2D);//gl.TEXTURE_2Dをmipmapに適用
		};

		var reader = new FileReader();
		reader.onloadend = function(){
			image.src = reader.result;
		};

		var h = new XMLHttpRequest();//You need local http server if you execute javascript in local host.
		h.responseType = "blob";
		h.onload = function(){
			reader.readAsDataURL(h.response);
		};
//kkk		handleTextureDefault(gl);//●issue occured
//○		h.open('GET',"http://localhost:8000/documents/games/3d/geo.png");
		h.open('GET',"http://localhost:8000/"+rootHTTPImages+this.name+".png");
		h.send();
		//To get url data, it's necessary to have been executing two applications listed below
		// ・chrome.exe --disable-web-security --user-data-dir//
		// ・ruby -run -e httpd . -p 8000//The dot '.' means current folda in which exeute ruby command.
		//		And set the variable rootHTTPImages with it
		//Ruby line is changable to python,php or other language to work as simple http local server.
	};
	Texture.prototype.make = function(oColor){
		//for webGL2
		var gl = this.gl;
		var level = 0;
		var internalFormat = gl.RGBA;
		var width = 1;
		var height = 1;
		var border = 0;
		var srcFormat = gl.RGBA;
		var srcType = gl.UNSIGNED_BYTE;
		var pixel = new Uint8Array([oColor.r,oColor.g,oColor.b,oColor.a]);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D,this.texture);
		gl.texImage2D(gl.TEXTURE_2D,level,internalFormat,width,height,border,srcFormat,srcType,pixel);
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
	function makeColorTexture(gl,oColor){
		var instance = new Texture(gl,name,Object.keys(oTextures).length);
		Object.defineProperty(oTextures,name,{value:instance,writable:false,enumerable:true,configurable:false});
		instance.make(oColor);
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


