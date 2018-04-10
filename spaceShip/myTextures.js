//******************************* TEXTURE ******************************************************


/**
 *for managing texture files and its entity only one object below
*/
(function(){

	//https://stackoverflow.com/questions/11292599/how-to-use-multiple-textures-in-webgl
	//class in this anonymous function
	var Texture = function(gl,name,number){
		this.gl = gl;
		this.name = name;//this is used for like this, rootHTTPImages+this.name+".png"
		this.number = number;//texture number
		this.read();
	};
	Texture.prototype.activate = function(){
//		this.gl.activeTexture(this.gl.TEXTURE0);//+this.number);//ここで保存されていればbindしなくて済む
		this.gl.bindTexture   (this.gl.TEXTURE_2D,this.texture);//kkk this.textureとしてアドレスを補完するべきなのか？それともTEXTURE0に保存さててしまうのか？
	};
	Texture.prototype.read = function(){
		var gl = this.gl;
		this.texture = gl.createTexture();
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

	//textures
	myTextures = { };

	var oTextures = { };
	var rootHTTPImages = "documents/games/3d/";//default

	Object.defineProperty(myTextures,'changeRootImage',{value:changeRootImage,writable:false,enumerable:false,configurable:false});
	function changeRootImage(sFolda){
		rootHTTPImages = sFolda;
		//code to recognize whether it exists or not
	};
		
	Object.defineProperty(myTextures,'create',{value:create,writable:false,enumerable:true,configurable:false});
	function create(gl,name){
		Object.defineProperty(oTextures,name,{value:new Texture(gl,name,Object.keys(oTextures).length),writable:false,enumerable:true,configurable:false});
		//If error occurs here,it may be because configurable and writable properties are false.
	};

	Object.defineProperty(myTextures,'member',{get:function(){return oTextures;}});

//nameをプロパティー名にするのは得策か？-> 参照方法を[name]とすれば固定されない
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


/*
function initTextures(gl,aTextures){
	cubeTexture = gl.createTexture();
	cubeImage = new Image();
	cubeImage.onload = function (){
		var canvas = document.createElement('canvas');
		document.getElementsByTagName('body')[0].appendChild(canvas);
//		canvas.width = 100;
//		canvas.height = 50;
//		canvas.style.position='absolute';
//		canvas.style.left='0px';
//		canvas.style.top='0px';
//		canvas.style.backgroundColor='transparent';
//		canvas.style.globalAlpa=0.7;
//		canvas.style.zIndex=100;
//		var ctx = canvas.getContext('2d');
//		ctx.drawImage(cubeImage,0,0);
		handleTextureLoaded(gl,cubeImage,cubeTexture);
	};

	var reader = new FileReader();
	reader.onloadend = function(){
		cubeImage.src = reader.result;
	};

	var h = new XMLHttpRequest();//You need local http server if you execute javascript in local host.
	h.responseType = "blob";
	h.onload = function(){
		reader.readAsDataURL(h.response);
	};

//kkk	handleTextureDefault(gl);//●issue occured
	h.open('GET',"http://localhost:8000/documents/games/3d/geo.png");
	h.send();
	//To get url data, it's necessary to have been executing two applications listed below
	// ・chrome.exe --disable-web-security --user-data-dir//
	// ・ruby -run -e httpd . -p 8000
	//2nd line is changable to python,php or other language to work as simple http local server.
};
function handleTextureLoaded(gl,image,texture){//gl.TEXTURE_2Dオブジェクトのプロパティーに値を入れる操作を行う


	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture   (gl.TEXTURE_2D,texture);
//●	gl.texImage2D    (gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
	gl.texImage2D    (gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
	gl.texParameteri (gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
	gl.texParameteri (gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_NEAREST);//gl.TEXTURE_2Dにbit演算している？
	gl.generateMipmap(gl.TEXTURE_2D);//gl.TEXTURE_2Dをmipmapに適用
//●	gl.activeTexture(gl.TEXTURE0);
//bad	gl.bindTexture   (gl.TEXTURE_2D,null);
//	gl.activeTexture(gl.TEXTURE0);
//	gl.bindTexture   (gl.TEXTURE_2D,texture);//●
};
function handleTextureDefault(gl){//●//when image data can not get from url
	//for webGL2
	var level = 0;
	var internalFormat = gl.RGBA;
	var width = 1;
	var height = 1;
	var border = 0;
	var srcFormat = gl.RGBA;
	var srcType = gl.UNSIGNED_BYTE;
	var pixel = new Uint8Array([0,0,255,255]);
	gl.texImage2D	 (gl.TEXTURE_2D,level,internalFormat,width,height,border,srcFormat,srcType,pixel);
};

*/

