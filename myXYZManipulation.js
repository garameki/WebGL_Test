libFileRelationship.create('myXYZManipulation');
libFileRelationship.myXYZManipulation.relatedTo='myMat4';
libFileRelationship.myXYZManipulation.relatedTo='myXYZ';


	var drawStep = 10;//milli seconds


	//for using under controlled space ship, follow to key board
	(function(){
		/** global scope **/
		myXYZManipulation = myXYZMani = { };

		//differential
		const dTurn = 0.01;//angle
		const dInject = 0.01;//Accelaration

		//key codes
		const AR=39;//→ Arrow Right
		const AL=37;//←
		const AU=38;//↑
		const AD=40;//↓
//		const SP=32;//space key
		const A=65;//a
		const Z=90;//z
		const W=87;//w
		const Q=81;//q
		const SH=16;//shift key
	
		//Inject (eventListener)
		var gInjectFB  = 0;
		var gInjectUD  = 0;
		var gInjectLR  = 0;

		//Rolling (eventListener)
		var gTurnAxZ = 0;//roll with axis Z
		var gTurnAxX = 0;//roll with axis X
		var gTurnAxY = 0;//roll with axis Y

//		var gMissile=false;
		var gAR=false;
		var gAL=false;
		var gAU=false;
		var gAD=false;
		var gA=false;
		var gZ=false;
		var gW=false;
		var gQ=false;
		var gSH=false;

		var Member = function(){
			myXYZ.SuperMember.call(this);
			this.x=0;
			this.y=0;
			this.z=0;


			this.speed = [0,0,0];

			//axiz to rotate
			this.frontAxis = [0, 0,-1];
			this.topAxis   = [0, 1, 0];
			this.rightAxis = [1, 0, 0];


			this.matAccume=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];//Identity
			this.matAccumeNotTranslated=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];//Identity
			this.matAccumeNotRotated=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];//Identity
		};
		myXYZ.inherits(Member);
		Member.prototype.upToDate = function(){
			this.speed.x = this.speed.x + gInjectLR;
			this.speed.y = this.speed.y + gInjectUD;
			this.speed.z = this.speed.z + gInjectFB;

	//		this.speed[2] += gDSpeed * 0.01;
			this.thetaLR  = gTurnAxY;
			this.thetaUD  = gTurnAxX;
			this.thetaRoll= gTurnAxZ;
	///		this.turnLR();
	///		this.turnUD();
	///		this.roll();
		};
		Member.prototype.turnLR = function(){
			this.frontAxis = myMat4.rotXYZ(0,1,0,this.thetaLR,this.frontAxis.x,this.frontAxis.y,this.frontAxis.z)
			var ux=this.frontAxis.x,uy=this.frontAxis.y,uz=this.frontAxis.z,vx=this.topAxis.x,vy=this.topAxis.y,vz=this.topAxis.z;
			this.rightAxis.x=uy*vz-uz*vy;
			this.rightAxis.y=uz*vx-ux*vz;
			this.rightAxis.z=ux*vy-uy*vx;
		};
		Member.prototype.turnUD = function(){
			this.forntAxis = myMat4.rotXYZ(1,0,0,this.thetaUD,this.frontAxis.x,this.frontAxis.y,this.frontAxis.z)
			var ux=this.rightAxis.x,uy=this.rightAxis.y,uz=this.rightAxis.z,vx=this.frontAxis.x,vy=this.frontAxis.y,vz=this.frontAxis.z;
			this.topAxis.x=uy*vz-uz*vy;
			this.topAxis.y=uz*vx-ux*vz;
			this.topAxis.z=ux*vy-uy*vx;
		};
		Member.prototype.roll = function(){

			var topAxis = myMat4.rotXYZ(0,0,1,this.thetaRoll,0,this.topAxis.y,this.topAxis.z)
			var ux=this.frontAxis.x,uy=this.frontAxis.y,uz=this.frontAxis.z,vx=this.topAxis.x,vy=this.topAxis.y,vz=this.topAxis.z;
			this.rightAxis.x=uy*vz-uz*vy;
			this.rightAxis.y=uz*vx-ux*vz;
			this.rightAxis.z=ux*vy-uy*vx;

		};




		var hero = new Member();//only one member is allowed to be made
		var flagSeatReserved = false;
		Object.defineProperty(myXYZMani,'createMember',{value:createMember});
		function createMember(){
			if(!flagSeatReserved){
				flagSeatReserved = true;
				return hero;
			}else{
				 console.error("myXYZManipulation.createMember() can't be done.The seat have already been reserved.");
				return null;
			}
		};

	
	


		Object.defineProperty(myXYZMani,'move',{value:move(hero)});
		function move(member){//member === hero
			var sumRemainder=0;
			return function(dt){
				sumRemainder+=dt;
				var n = Math.floor(sumRemainder/drawStep);//何回移動させるか
				sumRemainder=sumRemainder%drawStep;

				//accumerate all motions
				for(var ii=0;ii<n;ii++){

					member.upToDate();
	
					myMat4.load(member.matAccume);
						myMat4.trans(-member.speed.x,-member.speed.y,-member.speed.z);//これがなければいつも前に表示される
						myMat4.rot(0,1,0,member.thetaLR);
						myMat4.rot(1,0,0,member.thetaUD);
						myMat4.rot(0,0,1,member.thetaRoll);
					myMat4.storeTo(member.matAccume);

					//accumerate rotation only
					myMat4.load(member.matAccumeNotTranslated);
						//myMat4.trans(-member.speed.x,-member.speed.y,-member.speed.z);//これがなければいつも前に表示される
						myMat4.rot(0,1,0,member.thetaLR);
						myMat4.rot(1,0,0,member.thetaUD);
						myMat4.rot(0,0,1,member.thetaRoll);
					myMat4.storeTo(member.matAccumeNotTranslated);


	
					//accumerate translation only
					myMat4.load(member.matAccumeNotRotated);
						myMat4.trans(-member.speed.x,-member.speed.y,-member.speed.z);//これがなければいつも前に表示される
						//myMat4.rot(0,1,0,member.thetaLR);
						//myMat4.rot(1,0,0,member.thetaUD);
						//myMat4.rot(0,0,1,member.thetaRoll);
					myMat4.storeTo(member.matAccumeNotRotated);

					myMat4.loadIdentity();
						//don't touch here
							myMat4.rot(0,1,0,-member.thetaLR);
							myMat4.rot(1,0,0,member.thetaUD);
							myMat4.rot(0,0,1,member.thetaRoll);
						//

						//const len = member.speed.length3D;
						const x = member.speed.x;const y = member.speed.y;const z = member.speed.z;
						const a = myMat4.arr;
						member.speed.x = a[0]*x+a[1]*y+a[2]*z+a[3];
						member.speed.y = a[4]*x+a[5]*y+a[6]*z+a[7];
						member.speed.z = a[8]*x+a[9]*y+a[10]*z+a[11];
						//member.speed.normalize3D();//length3Dでspeed.x=speed.y=speed.z=0となるのでNaNになる
						//member.speed.mag3D(len);

				}
			};
		};

		//Burner Could be only used
		Object.defineProperty(myXYZMani,'accordingToKeyFlame',{value:accordingToKeyFlame});
		function accordingToKeyFlame(){

			return function(time){
			//touch from here

				if(false){
					//nothing
				
				}else if(gInjectLR < 0){
					myXYZ.rotate(0,0,1,0,-90)(time);
					myXYZ.translate(0.1,0,0)(time);
				}else if(gInjectLR > 0){
					myXYZ.rotate(0,0,1,0,90)(time);
					myXYZ.translate(-0.1,0,0)(time);
				}else if(gInjectUD < 0){
					myXYZ.rotate(1,0,0,0,0)(time);
					myXYZ.translate(0,0.1,0)(time);
				}else if(gInjectUD > 0){
					myXYZ.rotate(1,0,0,0,180)(time);
					myXYZ.translate(0,-0.1,0)(time);
				}else if(gInjectFB > 0){
					myXYZ.rotate(1,0,0,0,-90)(time);
				}else if(gInjectFB < 0){
					myXYZ.rotate(1,0,0,0,90)(time);
				}else{
					 myXYZ.translate(0,0,10)(time);
				}
			// to here
			};
		};


		window.addEventListener('keydown',keydown,false);
		function keydown(event){
			var key = event.keyCode;

			if(key==SH){
				gSH=true;
			}else if(key==AR){
				if(gSH) gTurnAxY=-dTurn;
				else gInjectLR=-dInject;
				gAR=true;
			}else if(key==AL){
				if(gSH) gTurnAxY=dTurn;
				else gInjectLR=dInject;
				gAL=true;
			}else if(key==AU){
				if(gSH) gTurnAxX = dTurn;
				else gInjectUD=-dInject;
				gAU=true;
			}else if(key==AD){
				if(gSH) gTurnAxX = -dTurn;
				else gInjectUD=dInject;
				gAD=true;
//			}else if(key==SP){	
//				if(gMissile==false)gMissile=true;
			}else if(key==A){
				gInjectFB=dInject;
				gA=true;
			}else if(key==Z){
				gInjectFB=-dInject;
				gZ=true;
			}else if(key==Q){
				gTurnAxZ=-dTurn;
				gQ=true;
			}else if(key==W){
				gTurnAxZ=dTurn;
				gW=true;
			};
		};
		window.addEventListener('keyup',keyup,false);
		function keyup(event){
			var key = event.keyCode;
	
			if(key==SH){
				gSH=false;
				gInjectLR=0;
				gInjectUD=0;
				gInjectFB=0;
				gTurnAxX=0;
				gTurnAxY=0;
				gTurnAxZ=0;
			}else if(key==AR){
				if(gAR){
					gAR=false;
				}else{
					console.error("ARのkeyDownを捉えていなかった");
				};
				if(gAL){
					if(gSH) gTurnAxY = -dTurn;
					else gInjectLR = -dInject;
				}else{
					gTurnAxY=0;
					gInjectLR=0;
				};
			}else if(key==AL){
				if(gAL){
					gAL=false;
				}else{
					console.error("ALのkeyDownを捉えていなかった");
				};
				if(gAR){
					if(gSH) gTurnAxY = dTurn;
					else gInjectLR = dInject;
				}else{
					gTurnAxY=0;
					gInjectLR=0;
				};
			}else if(key==AU){
				if(gAU){
					gAU=false;
				}else{
					console.error("AUのkeyDownを捉えていなかった");
				};
				if(gAD){
					if(gSH) gTurnAxX = -dTurn;
					gInjectUD=-dInject;
				}else{
					gTurnAxX=0;
					gInjectUD=0;
				};
			}else if(key==AD){
				if(gAD){
					gAD=false;
				}else{
					console.error("ADのkeyDownを捉えていなかった");
				};
				if(gAU){
					if(gSH) gTurnAxX=dTurn;
					gInjectUD=dInject;
				}else{
					gTurnAxX=0;
					gInjectUD=0;
				};
			}else if(key==A){
				if(gA){
					gA=false;
				}else{
					console.error("AのkeyDownを捉えていなかった");
				};
				if(gZ){
					gInjectFB=-dInject;
				}else{
					gInjectFB=0;
				};
			}else if(key==Z){
				if(gZ){
					gZ=false;
				}else{
					console.error("ZのkeyDownを捉えていなかった");
				};
				if(gA){
					gInjectFB=dInject;
				}else{
					gInjectFB=0;
				};
			}else if(key==W){
				if(gW){
					gW=false;
				}else{
					console.log("WのkeyDownを捉えていなかった");
				}
				if(gQ){
					gTurnAxZ=-dTurn;
				}else{
					gTurnAxZ=0;
				}
			}else if(key==Q){
				if(gQ){
					gQ=false;
				}else{
					console.log("QのkeyDownを捉えていなかった");
				}
				if(gW){
					gTurnAxZ=dTurn;
				}else{
					gTurnAxZ=0;
				}
			};
		};
	})();

