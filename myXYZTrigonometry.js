libFileRelationship.create('myXYZTrigonometry');
libFileRelationship.myXYZTrigonometry.relatedTo='myXYZ';
libFileRelationship.myXYZTrigonometry.relatedTo='myMat4';

	//for using trigonometric functions
	(function(){//xyz follow to trigonometric functions

		/** global scope **/
		myXYZTrigonometry = { };


		/** inner class **/
		var aMember = [];
		var Member = function(){//Note: The expression "function Member(){" to define occur a efficient issue.It's impossible to use variable 'Member' to inherits.
			myXYZ.SuperMember.call(this);
//○			this.rxy = 600;//*(Math.random()-0.5);
//○			this.rz  = 800;//0*(Math.random()-0.5);
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

		/** outer functions **/
		Object.defineProperty(myXYZTrigonometry,'createMember',{value:createMember});
		function createMember(r_xy,r_z,fTimes){
			var member = new Member();
			aMember.push(member);
			member.rxy = r_xy;//radius on x-y plane
			member.rz = r_z;//radius on (x or y)-z plane
			member.fTimes = fTimes;//回転倍率
			return member;
		};
		Object.defineProperty(myXYZTrigonometry,'reposAll',{value:repositionizeAllMembers()});
		function repositionizeAllMembers(){
			var sumTime=0;
			return function(dt){
				sumTime+=dt;
				for(var ii in aMember){
					aMember[ii].reposition(sumTime);
				}
			};
		};


	})();//trigonometric functionsotion
