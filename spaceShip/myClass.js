(function(){

	/** global scope **/
	myClass = { };
console.log("myClass.js");
	Object.defineProperty(myClass,'Point',{value:Point,writable:false,enumerable:true});
	function Point(x,y,z){
		this.x=x;
		this.y=y;
		this.z=z;
	};
	Point.prototype.calcTranslate = function(v){
		//@param {Point} out
		//@param {Vector} v
		return new myClass.Point(this.x+v.x,this.y+v.y,this.z+v.z);
	};
	Object.defineProperty(Point.prototype,'arr',{get:function(){return [this.x,this.y,this.z];},enumerable:true});



	Object.defineProperty(myClass,'Vector',{value:Vector,writable:false,enumerable:true});
	function Vector(x,y,z){
		this.x=x;
		this.y=y;
		this.z=z;
	};
	Vector.prototype.arr = function(){
		return [this.x,this.y,this.z];
	};
	Object.defineProperty(Vector.prototype,'length',{get:function(){return Math.pow(this.x*this.x+this.y*this.y+this.z*this.z,0.5);},enumerable:true,configurable:false});
	Object.defineProperty(Vector.prototype,'arr',{get:function(){return [this.x,this.y,this.z];},enumerable:true,configurable:false});
	Vector.prototype.calcLength = function(){
		return Math.pow(this.x*this.x+this.y*this.y+this.z*this.z,0.5);
	};
	Vector.prototype.makeMyselfUnitVector = function(){
		var len = 1/this.calcLength();
		this.x=this.x*len;
		this.y=this.y*len;
		this.z=this.z*len;
	};





//kkkk
	(function(){
		/* inner class */
		function Text(x,y,z,str,color){
			this.x=x;
			this.y=y;
			this.z=z;
			this.str=str;
			this.elementDiv=document.createElement("div");
			this.elementDiv.className='divGLText';
			this.elementDiv.style.color=color.rgba;
			document.getElementById("canvasContainer").appendChild(this.elementDiv);//kkk #canvasContainer only

			this.elementText = document.createTextNode("");
			this.elementText.className='textGLText';
			this.elementDiv.appendChild(this.elementText);
			this.elementText.nodeValue = str;

			var offset = myLib.getOffset(this.elementDiv.parentNode);//kkk to do that offsets get to be changable
			this.offsetLeft=0;//offset.left;
			this.offsetTop=0;//offset.top;
//			this.elementText.onclick=function(event){console.log("event=",event);};
		};
		Text.prototype.reposition = function(gl){
			// myMat4.load(pmat); 	must be done outside until before arriving here
			// myMat4.multi(mvmat);	muse be done outside until before arriving here
			var newP = myMat4.get2D(this.x,this.y,this.z);
			if(newP[2]>1){
				this.elementText.nodeValue=this.str+' behind';
			}else{
				this.elementText.nodeValue=this.str;
			}
			this.elementDiv.style.left = Math.floor((newP[0]+1)*gl.canvas.width*0.5+this.offsetLeft).toString()+"px";
			this.elementDiv.style.top = Math.floor((1-newP[1])*gl.canvas.height*0.5+this.offsetTop).toString()+"px";

		};
		Text.prototype.setText = function(str){
			this.elementText.nodeValue=str;
		};
//i think that the functions of myMat4 must be limited not to use globaly but to be used by suitable functions.

		//outer class
		Object.defineProperty(myClass,'Labels',{value:Labels,writable:false,enumerable:true,configurable:false});
		function Labels(){
			this.aTexts = [];
		};
		Labels.prototype.addText = function(x,y,z,str,color){
			this.aTexts.push(new Text(x,y,z,str,color));
		};
		Labels.prototype.repos = function(gl,pmat,mvmat){
			myMat4.load(mvmat);// 	must be done outside until before arriving here
			myMat4.multiArray(pmat);//	muse be done outside until before arriving here
			for(var ii=0;ii<this.aTexts.length;ii++){
				this.aTexts[ii].reposition(gl);
			}
		};

	})();

})();

