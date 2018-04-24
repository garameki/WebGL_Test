(function(){
	var drawStep = 10;//milli seconds

//sum=0;

	var inherits = function(childCtor, parentCtor) {
	  /** @constructor */
	  function tempCtor() {};
	  tempCtor.prototype = parentCtor.prototype;
	  childCtor.superClass_ = parentCtor.prototype;
	  childCtor.prototype = new tempCtor();
	  /** @override */
	  childCtor.prototype.constructor = childCtor;
	};

	//class
	function SuperMember(){

	};
	SuperMember.prototype.x = void 0;
	SuperMember.prototype.y = void 0;
	SuperMember.prototype.z = void 0;
	SuperMember.prototype.reposition = function(time){
		//interface to override
		alert("In SuperMember reposition() was not overrided yet.  this=",this);
	};
	SuperMember.prototype.ratioTime = 1;

	//for using under controlled space ship, follow to key board
	(function(){
		/** global scope **/
		myXYZMani = myXYZManipulation = { };

		//key codes
		const R=39;//→
		const L=37;//←
		const U=38;//↑
		const D=40;//↓
//		const SP=32;//space key
		const A=65;//a
		const Z=90;//z
		const W=87;//w
		const Q=81;//q
	
		//動き(eventListener)
		var gDSpeed   = 0;
		var gDRoll    = 0;
		var gDTurnUD  = 0;
		var gDTurnLR  = 0;

//		var gMissile=false;
		var gR=false;
		var gL=false;
		var gU=false;
		var gD=false;
		var gA=false;
		var gZ=false;
		var gW=false;
		var gQ=false;

		var Member = function(){
			SuperMember.call(this);
			this.x=0;
			this.y=0;
			this.z=0;


			this.speed = 0;

			//axiz to rotate
			this.frontX = 0;
			this.frontY = 0;
			this.frontZ = 1;
			this.topX=0;
			this.topY=1;
			this.topZ=0;
			this.rightX=1;
			this.rightY=0;
			this.rightZ=0;

			this.ratioR=0.01;

			this.matAccume=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
			this.matAccumeNotTranslated=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
			this.matAccumeNotRotated=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
		};
		inherits(Member,SuperMember);
		Object.defineProperty(Member.prototype,'thetaLR',{get:function(){return gDTurnLR*this.ratioR;}});
		Object.defineProperty(Member.prototype,'thetaUD',{get:function(){return gDTurnUD*this.ratioR;}});
		Object.defineProperty(Member.prototype,'thetaRoll',{get:function(){return gDRoll*this.ratioR;}});
//		Member.prototype.upToDate = function(){
//			this.thetaLR  =gDTurnLR*this.ratioR;
//			this.thetaUD  =gDTurnUD*this.ratioR;
//			this.thetaRoll=gDRoll  *this.ratioR;
//		};
		Member.prototype.goForward = function(){
//accelarate		if(gDSpeed>0)this.speed+=gDSpeed*0.0001;
//accelarate		else if(gDSpeed<0)this.speed+=gDSpeed*0.0005;

//move
			this.speed=gDSpeed*0.0001;
//move			
			if(this.speed>0.001)this.speed=0.001;
			else if(this.speed<-0.001)this.speed=-0.001;
//			else if(Math.abs(this.speed)<0.0002)this.speed=0;

			var length = 1/Math.pow(this.frontX*this.frontX+this.frontY*this.frontY+this.frontZ*this.frontZ,0.5);
		//	this.x+=this.frontX*length*this.speed;
		//	this.y+=this.frontY*length*this.speed;
		//	this.z-=gDSpeed*0.0001;//this.frontZ*length*this.speed;
		//●	this.z-=gDSpeed*0.01;//this.frontZ*length*this.speed;
			this.z-=gDSpeed*0.01;//this.frontZ*length*this.speed;
		};
		Member.prototype.turnLR = function(){
			var theta = gDTurnLR*this.ratioR;
/*
			var theta = -gDTurnLR*this.ratioR;
			var point = myMat4.rotXYZ(this.topX,this.topY,this.topZ,theta,this.frontX,this.frontY,this.frontZ)
			this.frontX=point[0];
			this.frontY=point[1];
			this.frontZ=point[2];
			var ux=this.frontX,uy=this.frontY,uz=this.frontZ,vx=this.topX,vy=this.topY,vz=this.topZ;
			this.rightX=uy*vz-uz*vy;
			this.rightY=uz*vx-ux*vz;
			this.rightZ=ux*vy-uy*vx;
*/
		};
		Member.prototype.turnUD = function(){
			var theta = -gDTurnUD*this.ratioR;
/*
			var theta = -gDTurnUD*this.ratioR;
			var point = myMat4.rotXYZ(this.rightX,this.rightY,this.rightZ,theta,this.frontX,this.frontY,this.frontZ)
			this.frontX=point[0];
			this.frontY=point[1];
			this.frontZ=point[2];
			var ux=this.rightX,uy=this.rightY,uz=this.rightZ,vx=this.frontX,vy=this.frontY,vz=this.frontZ;
			this.topX=uy*vz-uz*vy;
			this.topY=uz*vx-ux*vz;
			this.topZ=ux*vy-uy*vx;
*/
		};
		Member.prototype.roll = function(){
			var theta = gDRoll*this.ratioR;
/*
			var point = myMat4.rotXYZ(this.frontX,this.frontY,this.frontZ,theta,this.topX,this.topY,this.topZ)
			this.topX=point[0];
			this.topY=point[1];
			this.topZ=point[2];
			var ux=this.frontX,uy=this.frontY,uz=this.frontZ,vx=this.topX,vy=this.topY,vz=this.topZ;
			this.rightX=uy*vz-uz*vy;
			this.rightY=uz*vx-ux*vz;
			this.rightZ=ux*vy-uy*vx;
*/
		};

		var hero = new Member();//only one member is allowed to be made

		Object.defineProperty(myXYZMani,'createMember',{value:createMember});
		function createMember(){
			return hero;
		};

		Object.defineProperty(myXYZMani,'move',{value:move(hero)});
		function move(member){
			var sumRemainder=0;
			return function(dt){
				sumRemainder+=dt;
				var n = Math.floor(sumRemainder/drawStep);
				sumRemainder=sumRemainder%drawStep;

				//accumerate all motions
				myMat4.load(member.matAccume);
				for(var ii=0;ii<n;ii++){
					member.goForward();//_a is not used

					myMat4.trans(-member.x,-member.y,-member.z);//これがなければいつも前に表示される//ここでvecz=vecz+this.zが行われる
//sum+=member.y;
//console.log("accumeMotionsXYZ.js sum=",sum);
					member.turnUD();//_a is not used
					myMat4.rot(member.rightX,member.rightY,member.rightZ,member.thetaUD);
					member.turnLR();//_a is not used
					myMat4.rot(member.topX,member.topY,member.topZ,member.thetaLR);
					member.roll();// _a is not used
					myMat4.rot(member.frontX,member.frontY,member.frontZ,member.thetaRoll);
				}
				myMat4.storeTo(member.matAccume);

				//accumerate rotation only
				myMat4.load(member.matAccumeNotTranslated);
				for(var ii=0;ii<n;ii++){
					//member.goForward();
					//myMat4.trans(-member.x,-member.y,-member.z);//これがなければいつも前に表示される
					myMat4.rot(member.rightX,member.rightY,member.rightZ,member.thetaUD);
					//member.turnUD();
					myMat4.rot(member.topX,member.topY,member.topZ,member.thetaLR);
					//member.turnLR();
					myMat4.rot(member.frontX,member.frontY,member.frontZ,member.thetaRoll);
					//member.roll();
				}
				myMat4.storeTo(member.matAccumeNotTranslated);

				//accumerate translation only
				myMat4.load(member.matAccumeNotRotated);
				for(var ii=0;ii<n;ii++){
					//member.goForward();
					myMat4.trans(-member.x,-member.y,-member.z);//これがなければいつも前に表示される
					//member.turnUD();
					//myMat4.rot(member.rightX,member.rightY,member.rightZ,member.thetaUD);
					//member.turnLR();
					//myMat4.rot(member.topX,member.topY,member.topZ,member.thetaLR);
					//member.roll();
					//myMat4.rot(member.frontX,member.frontY,member.frontZ,member.thetaRoll);
				}
				myMat4.storeTo(member.matAccumeNotRotated);


			};
		};

		window.addEventListener('keydown',keydown,false);
		function keydown(event){
			var key = event.keyCode;

			if(key==R){
				gDTurnLR=1;
				gR=true;
			}else if(key==L){
				gDTurnLR=-1;
				gL=true;
			}else if(key==U){
				gDTurnUD=-1;
				gU=true;
			}else if(key==D){
				gDTurnUD=1;
				gD=true;
//			}else if(key==SP){	
//				if(gMissile==false)gMissile=true;
			}else if(key==A){
				gDSpeed=1;
				gA=true;
			}else if(key==Z){
				gDSpeed=-1;
				gZ=true;
			}else if(key==Q){
				gDRoll=-1;
				gQ=true;
			}else if(key==W){
				gDRoll=1;
				gW=true;
			};
		};
		window.addEventListener('keyup',keyup,false);
		function keyup(event){
			var key = event.keyCode;
	
			if(key==R){
				if(gR){
					gR=false;
				}else{
					console.error("RのkeyDownを捉えていなかった");
				};
				if(gL){
					gDTurnLR=1;
				}else{
					gDTurnLR=0;
				};
			}else if(key==L){
				if(gL){
					gL=false;
				}else{
					console.error("LのkeyDownを捉えていなかった");
				};
				if(gR){
					gDTurnLR=-1;
				}else{
					gDTurnLR=0;
				};
			}else if(key==U){
				if(gU){
					gU=false;
				}else{
					console.error("UのkeyDownを捉えていなかった");
				};
				if(gD){
					gDTurnUD=-1;
				}else{
					gDTurnUD=0;
				};
			}else if(key==D){
				if(gD){
					gD=false;
				}else{
					console.error("DのkeyDownを捉えていなかった");
				};
				if(gU){
					gDTurnUD=1;
				}else{
					gDTurnUD=0;
				};
			}else if(key==A){
				if(gA){
					gA=false;
				}else{
					console.error("AのkeyDownを捉えていなかった");
				};
				if(gZ){
					gDSpeed=-1;
				}else{
					gDSpeed=0;
				};
			}else if(key==Z){
				if(gZ){
					gZ=false;
				}else{
					console.error("ZのkeyDownを捉えていなかった");
				};
				if(gA){
					gDSpeed=1;
				}else{
					gDSpeed=0;
				};
			}else if(key==W){
				if(gW){
					gW=false;
				}else{
					console.log("WのkeyDownを捉えていなかった");
				}
				if(gQ){
					gDRoll=-1;
				}else{
					gDRoll=0;
				}
			}else if(key==Q){
				if(gQ){
					gQ=false;
				}else{
					console.log("QのkeyDownを捉えていなかった");
				}
				if(gW){
					gDRoll=1
				}else{
					gDRoll=0;
				}
			};
		};
	})();

	//for using trigonometric functions
	(function(){//xyz follow to trigonometric functions

		/** global scope **/
		myXYZTrigonometry = { };


		var aMember = [];
		var Member = function(){//Note: The expression "function Member(){" to define occur a efficient issue.It's impossible to use variable 'Member' to inherits.
			SuperMember.call(this);
			this.rxy = 250;//*(Math.random()-0.5);
			this.rz  = 250;//*(Math.random()-0.5);
			this.alpha = Math.random()*2*3.14;
			this.gamma = Math.random()*2*3.14;
		};
		inherits(Member,SuperMember);
		//@override
		Member.prototype.reposition = function(totalTime){
			this.x=this.rxy * Math.cos(this.ratioTime*totalTime+this.alpha);
			this.y=this.rxy * Math.sin(this.ratioTime*totalTime+this.alpha);
			this.z=this.rz  * Math.sin(this.ratioTime*totalTime+this.gamma);
		};
		//@override
		Member.prototype.ratioTime = Math.PI*0.00555555555*0.005;

		Object.defineProperty(myXYZTrigonometry,'createMember',{value:createMember});
		function createMember(){
			var member = new Member();
			aMember.push(member);
			return member;
		};
		Object.defineProperty(myXYZTrigonometry,'reposAll',{value:repositionizeAllMembers()});
		function repositionizeAllMembers(){
			var sumTime=0;
			return function(dt){
				sumTime+=dt;
				for(var ii=0,len=aMember.length;ii<len;ii++){
					aMember[ii].reposition(sumTime);
				}
			};
		};


	})();//trigonometric functions

		//for using gravity, follow to gravity (between members only)
	(function(){

		myXYZGravity = { };

		var aMember = [];
		var Member = function(mass,x,y,z,vx,vy,vz){
			SuperMember.call(this);	
			this.m = mass;
			this.x=x;
			this.y=y;
			this.z=z;
			this.vx=vx;
			this.vy=vy;
			this.vz=vz;
		};
		inherits(Member,SuperMember);

		Object.defineProperty(myXYZGravity,'length',{get:function(){return aMember.length;}});

		Object.defineProperty(myXYZGravity,'member',{value:getMemberByIndex});
		function getMemberByIndex(){
			return function(num){
				if(num>=aMember.length || num<0){
					myInfo.caution('number is out of range. num='+num.toString());
				}
				return aMember[num];
			};
		};
		Object.defineProperty(myXYZGravity,'createMember',{value:createMember});
		function createMember(m,x,y,z,vx,vy,vz){
			var mem =new Member(m,x,y,z,vx,vy,vz);
			aMember.push(mem);
			return mem;
		};
		Object.defineProperty(myXYZGravity,'reposAll',{value:repositionAll});
		function repositionAll(dt){

			dt=dt/50;
			g=1/5;
			var mem1,mem2,dist,force;
			var sumFx,sumFy,sumFz;
			var len = aMember.length;
			for(var ii=0;ii<len;ii++){
				sumFx=0;sumFy=0;sumFz=0;
				mem1=aMember[ii];
				for(var jj=0;jj<len;jj++){
					if(ii==jj){
						//nothing to do
					}else{
						mem2=aMember[jj];
						dist = 1/((mem1.x-mem2.x)*(mem1.x-mem2.x)+(mem1.y-mem2.y)*(mem1.y-mem2.y)+(mem1.z-mem2.z)*(mem1.z-mem2.z));
						force = -g*mem1.m*mem2.m*dist;
//console.log("force=",force);
						dist=Math.pow(dist,0.5);
						sumFx += force * (mem1.x-mem2.x)*dist;
						sumFy += force * (mem1.y-mem2.y)*dist;
						sumFz += force * (mem1.z-mem2.z)*dist;
					}
				}

				mem1.x+=mem1.vx*dt;
				mem1.y+=mem1.vy*dt;
				mem1.z+=mem1.vz*dt;
				mem1.vx+=sumFx*dt/mem1.m;
				mem1.vy+=sumFy*dt/mem1.m;
				mem1.vz+=sumFz*dt/mem1.m;
			}
//			var mem;
//			for(var kk=0;kk<aMember.length;kk++){
//				mem = aMember[kk];
//				console.log("mem["+kk.toString()+"] x:",mem.x,"y:",mem.y,"z:",mem.z);
//			}
		};
	})();//gravity

	//for translating and/or rotating members above
	(function(){

		/** global scope **/
		AccumeMotionsXYZ = { };


		/* for myXYZ object families */
		Object.defineProperty(AccumeMotionsXYZ,'replaceView',{value:replaceCenterAndDirection});
		function replaceCenterAndDirection(member){
			return function(time){
				myMat4.multiArray(member.matAccume);
			};
		};
		Object.defineProperty(AccumeMotionsXYZ,'replaceViewNotTrans',{value:replaceCenterAndDirectionNotTranslated});
		function replaceCenterAndDirectionNotTranslated(member){
			return function(time){
				myMat4.multiArray(member.matAccumeNotTranslated);
			};
		};
		Object.defineProperty(AccumeMotionsXYZ,'replaceViewNotRotate',{value:replaceCenterAndDirectionNotRotated});
		function replaceCenterAndDirectionNotRotated(member){
			return function(time){
				myMat4.multiArray(member.matAccumeNotRotated);
			};
		};
		Object.defineProperty(AccumeMotionsXYZ,'trans',{value:translateXYZ});
		function translateXYZ(member){
			return function(time){
				myMat4.trans(member.x,member.y,member.z);
			};
		};
		Object.defineProperty(AccumeMotionsXYZ,'replaceOrigin',{value:replaceCenterToOriginOf});
		function replaceCenterToOriginOf(member){
			return function(time){
				myMat4.trans(-member.x,-member.y,-member.z);
			};
		};
	})();//motion
})();
