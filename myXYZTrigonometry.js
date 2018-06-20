libFileRelationship.create('myXYZTrigonometry');
libFileRelationship.myXYZTrigonometry.relatedTo='myXYZ';
libFileRelationship.myXYZTrigonometry.relatedTo='myMat4';

	//for using trigonometric functions
	(function(){//xyz follow to trigonometric functions

		/** global scope **/
		myXYZTrigonometry = { };




		/** inner class **/
		var Member = function(r_xy,r_z,fTimes){//Note: The expression "function Member(){" to define occur a efficient issue.It's impossible to use variable 'Member' to inherits.
			myXYZ.SuperMember.call(this);
			this.rxy = r_xy;//radius on x-y plane
			this.rz = r_z;//radius on (x or y)-z plane
			this.fTimes = fTimes;//回転倍率
			this.alpha = 2*3.14*Math.random();
			this.gamma = 2*3.14*Math.random();
		};
		myXYZ.inherits(Member);
		//@override
		Member.prototype.reposition = function(totalTime){
			this.x=this.rxy * Math.cos(this.fTimes*this.ratioTime*totalTime+this.alpha);
			this.y=this.rxy * Math.sin(this.fTimes*this.ratioTime*totalTime+this.alpha);
			this.z=this.rz  * Math.sin(this.fTimes*this.ratioTime*totalTime+this.gamma);
		};
		//@override
		Member.prototype.ratioTime = Math.PI*0.00555555555*0.005;

		const TRUE = true;
console
		/** outer functions **/
		Object.defineProperty(myXYZTrigonometry,'createMember',{value:createMember,writable:false,enumerable:false,configurable:false});
		function createMember(sName,r_xy,r_z,fTimes){
			var member = new Member(r_xy,r_z,fTimes);
			Object.defineProperty(myXYZTrigonometry,sName,{value:member,writable:false,enumerable:TRUE,configurable:false});
			return member;
		};
		Object.defineProperty(myXYZTrigonometry,'reposAll',{value:repositionizeAllMembers(),writable:false,enumerable:false,configurable:false});
		function repositionizeAllMembers(){
			var sumTime=0;
			return function(dt){
				sumTime+=dt;
				for(let name in myXYZTrigonometry){
					myXYZTrigonometry[name].reposition(sumTime);
				}
			};
		};


	})();//trigonometric functionsotion
