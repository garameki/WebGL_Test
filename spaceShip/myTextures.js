//******************************* TEXTURE ******************************************************


/**
 *for managing texture files and its entity only one object below
*/
(function(){

		//reference
		//https://stackoverflow.com/questions/11292599/how-to-use-multiple-textures-in-webgl
		//https://stackoverflow.com/questions/8688600/context-getimagedata-on-localhost
	/** inner class **/
	var Texture = function(gl,name,number){
		this.gl = gl;
		this.name = name;//this is used for like this, rootHTTPImages+this.name+".png"
		this.number = number;//texture number
		this.texture = gl.createTexture();
	};
	Texture.prototype.activate = function(){

		this.gl.activeTexture(this.gl.TEXTURE0);//+this.number);//ここで保存されていればbindしなくて済む
//console.log("myTextures.js:activeTexture=",this.gl.getParameter(this.gl.ACTIVE_TEXTURE));
//console.log("myTextures.js:this.texture=",this.texture,"name=",this.name);

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
			gl.texParameteri (gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_NEAREST);//gl.TEXTURE_2Dにbit演算している？gl.ACTIVE_TEXTURE
			gl.generateMipmap(gl.TEXTURE_2D);//gl.TEXTURE_2Dをmipmapに適用
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
				myInfo.main.caution="404 error occured in myTextures.js at '"+this.name+"'";
/*maze
				//https://webglfundamentals.org/webgl/lessons/webgl-data-textures.html
				//https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL				const texture = gl.createTexture();
				//https://github.com/mrdoob/three.js/issues/386
				var pixel = new Uint8Array([255,255,255,255]);
				//gl.activeTexture(gl.TEXTURE0);//kkk
				//gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
				gl.bindTexture(gl.TEXTURE_2D,this.texture);
				gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
				//gl.texParameteri (gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
				//gl.texParameteri (gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_NEAREST);//gl.TEXTURE_2Dにbit演算している？
*/

			image.src = "../niku_stand2.png";//default



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
	Texture.prototype.make = function(oColor){
		//for webGL2

//Does this code work?
		var gl = this.gl;
		var level = 0;
		var internalFormat = gl.RGBA;
		var width = 2;
		var height = 2;
		var border = 0;
		var srcFormat = gl.RGBA;
		var srcType = gl.UNSIGNED_BYTE;
		var pixel = new Uint8Array([
			oColor.r,oColor.g,oColor.b,oColor.a,
			oColor.r,oColor.g,oColor.b,oColor.a,
			oColor.r,oColor.g,oColor.b,oColor.a,
			oColor.r,oColor.g,oColor.b,oColor.a
		]);
//		var pixel = new Uint8Array([1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0]);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D,this.texture);
		gl.texImage2D(gl.TEXTURE_2D,level,internalFormat,width,height,border,srcFormat,srcType,pixel);
//		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
		gl.texParameteri (gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
		gl.texParameteri (gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_NEAREST);//gl.TEXTURE_2Dにbit演算している？
		gl.generateMipmap(gl.TEXTURE_2D);//gl.TEXTURE_2Dをmipmapに適用
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
	function makeColorTexture(gl,name,oColor){
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


