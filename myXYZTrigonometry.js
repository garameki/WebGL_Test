libFileRelationship.create('myXYZTrigonometry');
libFileRelationship.myXYZTrigonometry.relatedTo='myXYZ';
libFileRelationship.myXYZTrigonometry.relatedTo='myMat4';

	//for using trigonometric functions
	(function(){//xyz follow to trigonometric functions

		/** global scope **/
		myXYZTrigonometry = { };

		// real           screen
		//one hour ----- one year
		//3600000ms----- 360°(earth) 
		//			[°]/[h] * [rad]/[°] * [ms]/[h]
		const anglePerHour = (360/365/24)*(Math.PI/180)/(3600000/365/24);//[rad/ms]----1 sidereal period of earth per real time 1 hour

		/** inner class **/
		/**
		 * @param {Number} period ... earth = 1.000000
		**/
		var Member = function(r_xy,r_z,period){
			myXYZ.SuperMember.call(this);
			this.rxy = r_xy;//radius on x-y plane
			this.rz = r_z;//radius on (x or y)-z plane
			this.fTimes = anglePerHour/period;//公転角速度real timeの411msでanglePerHour°回転する
			this.alpha = 2*3.14*Math.random();
			this.gamma = 2*3.14*Math.random();
		};
		myXYZ.inherits(Member);
		//@override
		Member.prototype.reposition = function(totalTime){
			this.x=this.rxy * Math.cos(this.fTimes*totalTime+this.alpha);
			this.y=this.rxy * Math.sin(this.fTimes*totalTime+this.alpha);
			this.z=this.rz  * Math.sin(this.fTimes*totalTime+this.gamma);
		};

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
