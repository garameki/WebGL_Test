//******************************************** framebuffer **********************************************
/************************************************with****************************************************
//********************************** texture buffers & render buffer*************************************
/**
 *make render buffer with frame buffer and texture of void
*/
(function(){
//:myFBOs
	myFBOs = { };
	Object.defineProperty(myFBOs,'create',{value:create,writable:false,enumerable:true,configurable:false});
	function create(sName,gl,tWidth,tHeight,vWidth,vHeight){
		Object.defineProperty(myFBOs,sName,{value:new FBO(gl,tWidth,tHeight,vWidth,vHeight,sName),writable:false,enumerable:true,configurable:true});
	};

	/** the structure of color buffer mode using texImage2D **/
	var obj1 = {
		internalFormat:function(gl){return gl.RGBA;},
		format:function(gl){return gl.RGBA;},
		type:function(gl){return gl.UNSIGNED_SHORT_4_4_4_4;}
	};
	var obj2 = {
		internalFormat:function(gl){return gl.RGBA;},
		format:function(gl){return gl.RGBA;},
		type:function(gl){gl.UNSIGNED_SHORT_5_5_5_1;}
	};
	var obj3 = {
		internalFormat:function(gl){return gl.ALPHA;},
		format:function(gl){return gl.ALPHA;},
		type:function(gl){return gl.UNSIGNED_BYTE;}
	};
	Object.defineProperty(myFBOs,'colorBufferModeIsRGBA4444',{value:obj1,enumerable:false,configurable:false});
	Object.defineProperty(myFBOs,'colorBufferModeIsRGBA5551',{value:obj2,enumerable:false,configurable:false});
	Object.defineProperty(myFBOs,'colorBufferModeIsALPHA',{value:obj3,enumerable:false,configurable:false});
	

	//reference
	//https://wgld.org/d/webgl/w051.html
	//http://www.chinedufn.com/webgl-shadow-mapping-tutorial/
	//https://stackoverflow.com/questions/41824631/how-to-work-with-framebuffers-in-webgl/41832778#41832778
	//http://www.wakayama-u.ac.jp/~tokoi/lecture/gg/ggnote13.pdf
	//http://www.songho.ca/opengl/gl_fbo.html
	/** inner class **/
	  //Texture, Framebuffer and Renderbuffer are necessary at once.
	var FBO = function(gl,tWidth,tHeight,vWidth,vHeight,sName){
		this.gl = gl;

		this.name = sName;

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

		//the setting before activation calling
		this.colorMasks = void 0;
		this.depthTest = void 0;
		this.stencilTest = void 0;

		//the textures using as buffer
		this.textureColorBuffer = void 0;
		this.textureDepthBuffer = void 0;
		this.textureStencilBuffer = void 0;

//		this.initializeTextureColorBuffer();
//		this.initializeTextureDepthBuffer();
//		this.initializeTextureStencilBuffer();
	};

//{
//	http://www.wakayama-u.ac.jp/~tokoi/lecture/gg/ggnote13.pdf
//	これらを入れれば、viewportのサイズを画面と同じにしなくてもいいのではないだろうか？
//	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S,
//	GL_CLAMP_TO_EDGE);
//	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T,
//	GL_CLAMP_TO_EDGE);
//}

	FBO.prototype.initializeTextureColorBuffer = function(colorMode){
		/** prepare texture rendered into **/
		var gl = this.gl;

		this.textureColorBuffer = gl.createTexture();
		this.textureColorBuffer._name = "ColorBufferTexture";
			gl.bindTexture(gl.TEXTURE_2D,this.textureColorBuffer);//-->gl.TEXTURE[?]
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);//kkk
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);//kkk
//unchangable is not convenient	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,this.tWidth,this.tHeight,0,gl.RGBA,gl.UNSIGNED_SHORT_4_4_4_4,null);//pass no image into gl.TEXT[\d+]
			gl.texImage2D(gl.TEXTURE_2D,0,colorMode.internalFormat(gl),this.tWidth,this.tHeight,0,colorMode.format(gl),colorMode.type(gl),null);//pass no image into gl.TEXT[\d+]
	};
	FBO.prototype.initializeTextureDepthBuffer = function(){
		/** prepare texture rendered into **/
		var gl = this.gl;

		//https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture
		this.textureDepthBuffer = gl.createTexture();
		this.textureDepthBuffer._name = "DepthBufferTexture";
			gl.bindTexture(gl.TEXTURE_2D,this.textureDepthBuffer);//-->gl.TEXTURE[?]
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);//kkk
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);//kkk
//low quality to render	gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH_COMPONENT16,this.tWidth,this.tHeight,0,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,null);//pass no image into gl.TEXT[\d+]
			gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH24_STENCIL8,this.tWidth,this.tHeight,0,gl.DEPTH_STENCIL,gl.UNSIGNED_INT_24_8,null);//pass no image into gl.TEXT[\d+]
	};
	FBO.prototype.initializeTextureStencilBuffer = function(){
		/** prepare texture rendered into **/
		var gl = this.gl;

		//https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture
		this.textureStencilBuffer = gl.createTexture();
		this.textureStencilBuffer._name = "StencilBufferTexture";
			gl.bindTexture(gl.TEXTURE_2D,this.textureStencilBuffer);//-->gl.TEXTURE[?]
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);//kkk
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);//kkk
			gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH24_STENCIL8,this.tWidth,this.tHeight,0,gl.DEPTH_STENCIL,gl.UNSIGNED_INT_24_8,null);//pass no image into gl.TEXT[\d+]
	};
	FBO.prototype.activate = function(){//(sMode,colorBufferMode)
		var sMode = arguments[0];
		var colorBufferMode;
		if(arguments.length == 2){
			colorBufferMode = arguments[1];
		}else{
			colorBufferMode = null;
		}
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
				if(colorBufferMode==null){
					myInfo.main.error = "Please specify the second argument of myFBOs."+this.name+".activate()";
				}else if(colorBufferMode==void 0){
					myInfo.main.error = "Please modify the second argument of myFBOs."+this.name+".activate(). The second argument is 'undefined'.";
				}
				gl.colorMask(true,true,true,true);
				this.initializeTextureColorBuffer(colorBufferMode);
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
				this.initializeTextureDepthBuffer();
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
				this.initializeTextureStencilBuffer();
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
	};
})();
