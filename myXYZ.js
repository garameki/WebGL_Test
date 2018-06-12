	//for translating and/or rotating members above

	/**
	 * @param {Object} memberXYZ  instance of myXYZManipulated,myXYZTrigonometry or myXYZGravity
	**/

(function(){




	/** global scope **/
	myXYZ = { };


	/* for myXYZ object families */
	Object.defineProperty(myXYZ,'replaceView',{value:replaceCenterAndDirection});
	function replaceCenterAndDirection(memberXYZ){
		return function(time){
			myMat4.multiArray(memberXYZ.matAccume);
		};
	};
	Object.defineProperty(myXYZ,'replaceViewNotTrans',{value:replaceCenterAndDirectionNotTranslated});
	function replaceCenterAndDirectionNotTranslated(memberXYZ){
		return function(time){
			myMat4.multiArray(memberXYZ.matAccumeNotTranslated);
		};
	};
	Object.defineProperty(myXYZ,'replaceViewNotRotate',{value:replaceCenterAndDirectionNotRotated});
	function replaceCenterAndDirectionNotRotated(memberXYZ){
		return function(time){
			myMat4.multiArray(memberXYZ.matAccumeNotRotated);
		};
	};
	Object.defineProperty(myXYZ,'replaceOrigin',{value:replaceCenterToOriginOf});
	function replaceCenterToOriginOf(memberXYZ){
		return function(time){
			myMat4.trans(-memberXYZ.x,-memberXYZ.y,-memberXYZ.z);
		};
	};



	/* for usually use */
	Object.defineProperty(myXYZ,'none'	,{value:doNothing,enumerable:true});
	function doNothing(){
		return function(time){
			//do nothing
		};
	};
	Object.defineProperty(myXYZ,'random'	,{value:random,enumerable:true});//paste randome place in space
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
	Object.defineProperty(myXYZ,'axisY'	,{value:axisY,writable:false,enumerable:true});
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
	Object.defineProperty(myXYZ,'trans',{value:translateMember,enumerable:true});
	function translateMember(memberXYZ){
		return function(time){
			myMat4.trans(memberXYZ.x,memberXYZ.y,memberXYZ.z);
		};
	};
	Object.defineProperty(myXYZ,'translate',{value:translateArbitraryQuantity,enumerable:true});
	function translateArbitraryQuantity(x,y,z){
		return function(time){
			myMat4.trans(x,y,z);
		};
	};
	Object.defineProperty(myXYZ,'rotate',{value:rotate,writable:false,enumerable:true});
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
	Object.defineProperty(myXYZ,'gotoOrigin',{value:gotoOrigin,writable:false,enumerable:true});
	function gotoOrigin(){
		return function(time){
			myMat4.loadZero();
		};
	};

})();

