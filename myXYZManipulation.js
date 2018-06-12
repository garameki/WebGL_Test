libFileRelationship.create('myXYZManipulation');
libFileRelationship.myXYZManipulation.relatedTo='myMat4';

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
		myXYZManipulation = myXYZMani = { };

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

			this.speedX = 0;
			this.speedY = 0;
			this.speedZ = 0;



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

			this.matAccume=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];//Identity
			this.matAccumeNotTranslated=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];//Identity
			this.matAccumeNotRotated=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];//Identity
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
				var n = Math.floor(sumRemainder/drawStep);//何回移動させるか
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

