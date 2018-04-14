(function(){
//make a complex matrix multiplyed to be accumerated

	AccumeMotions = { };

	/* for usually use */
	Object.defineProperty(AccumeMotions,'none'	,{value:doNothing,enumerable:true});
	function doNothing(){
		return function(time){
			//nothing to do
		};
	};
	Object.defineProperty(AccumeMotions,'random'	,{value:random,enumerable:true});
	function random(){
		var rx = Math.floor(Math.random()*100)/10;
		var ry = Math.floor(Math.random()*100)/10;
		var rz = Math.floor(Math.random()*100)/10;
		var m = Math.floor(Math.random()*3+1);
		var tx = 2-Math.floor(Math.random()*4);
		var ty = 2-Math.floor(Math.random()*4);

		return function(time){

			//model view matrix...myMat4 was already defined in global scope
			myMat4.trans(tx,ty,-6.0);
			myMat4.rotO(rx,ry,rz,m*time*Math.PI/180);
		}
	};
	Object.defineProperty(AccumeMotions,'axisY'	,{value:axisY,writable:false,enumerable:true});
	function axisY(speed){
		var vx = 0;
		var vy = 1;
		var vz = 0;

		var ratio = speed * Math.PI/180;
		return function(time){

			//model view matrix...myMat4 was already defined in global scope
			myMat4.rot(vx,vy,vz,time*ratio);//●
		}
	};
	Object.defineProperty(AccumeMotions,'translate',{value:translateArbitaryQuantity,enumerable:true});
	function translateArbitaryQuantity(x,y,z){
		return function(time){
			myMat4.trans(x,y,z);
		};
	};
	Object.defineProperty(AccumeMotions,'rotate',{value:rotate,writable:false,enumerable:true});
	function rotate(rx,ry,rz,ratio,deg0){
		//@param {number} tx,ty,tz	quantum according to cartesian coordinate to translate
		//@param {number} rx,ry,rz	vector of axis which is center of rotation
		//@param {number} deg0		initially angle of rotation
		//@param {number} ratio		ratio of rotation speed
		var ratio = ratio*Math.PI*0.0055555555555;// /180;
		var rad0 = deg0*Math.PI*0.00555555555555;// /180;
		return function(time){
//console.log("deg0=",rad0);

			//model view matrix...myMat4 was already defined in global scope
			myMat4.rot(rx,ry,rz,ratio*time+rad0);
		}
	};
	Object.defineProperty(AccumeMotions,'gotoOrigin',{value:gotoOrigin,writable:false,enumerable:true});
	function rotate(rx,ry,rz,ratio,deg0){
		return function(time){
			myMat4.loadZero();
		};
	};

})();

