extArray=null;//This is dummy.Because there is not 'extArray' object.
libFileRelationship.create('extArray');

//extend Array class

/* */(function(){
	Object.defineProperty(Array.prototype,'x',{get:function(){return this[0];},set:function(n){this[0]=n},enumerable:false,configurable:false});
	Object.defineProperty(Array.prototype,'y',{get:function(){return this[1];},set:function(n){this[1]=n},enumerable:false,configurable:false});
	Object.defineProperty(Array.prototype,'z',{get:function(){return this[2];},set:function(n){this[2]=n},enumerable:false,configurable:false});
//	Object.defineProperty(Array.prototype,'arr3D',{get:function(){return [this[0],this[1],this[2]];},enumerable:false,configurable:false});
	Object.defineProperty(Array.prototype,'length3D',{get:function(){return Math.sqrt(this[0]*this[0]+this[1]*this[1]+this[2]*this[2]);},enumerable:false,configurable:false});
	Object.defineProperty(Array.prototype,'normalize3D',{value:normalize3D,writable:false,enumerable:false,configurable:false});
	function normalize3D(){
		var len = 1. / this.length3D;
		this[0] = this[0] * len;
		this[1] = this[1] * len;
		this[2] = this[2] * len;
	};
	Object.defineProperty(Array.prototype,'opposite3D',{value:opposite3D,writable:false,enumerable:false,configurable:false});
	function opposite3D(){
		this[0] = -this[0];
		this[1] = -this[1];
		this[2] = -this[2];
	};

/* */})();
