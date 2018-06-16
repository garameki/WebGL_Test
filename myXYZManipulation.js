libFileRelationship.create('myXYZManipulation');
libFileRelationship.myXYZManipulation.relatedTo='myMat4';
libFileRelationship.myXYZManipulation.relatedTo='myXYZ';


	var drawStep = 10;//milli seconds


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
			myXYZ.SuperMember.call(this);
			this.x=0;
			this.y=0;
			this.z=0;


			this.speed = [0,0,0];

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
		myXYZ.inherits(Member);
		Member.prototype.upToDate = function(){
			this.speed[2] += gDSpeed * 0.01;
			this.thetaLR  = -gDTurnLR*this.ratioR;
			this.thetaUD  = -gDTurnUD*this.ratioR;
			this.thetaRoll=  gDRoll  *this.ratioR;
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
		function move(member){
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
						myMat4.rot(member.rightX,member.rightY,member.rightZ,member.thetaUD);
						myMat4.rot(member.topX,member.topY,member.topZ,member.thetaLR);
						myMat4.rot(member.frontX,member.frontY,member.frontZ,member.thetaRoll);
					myMat4.storeTo(member.matAccume);

					//accumerate rotation only
					myMat4.load(member.matAccumeNotTranslated);
						//myMat4.trans(-member.speedX,-member.speedY,-member.speedZ);//これがなければいつも前に表示される
						myMat4.rot(member.rightX,member.rightY,member.rightZ,member.thetaUD);
						myMat4.rot(member.topX,member.topY,member.topZ,member.thetaLR);
						myMat4.rot(member.frontX,member.frontY,member.frontZ,member.thetaRoll);
					myMat4.storeTo(member.matAccumeNotTranslated);
	
					//accumerate translation only
					myMat4.load(member.matAccumeNotRotated);
						myMat4.trans(-member.speedX,-member.speedY,-member.speedZ);//これがなければいつも前に表示される
						//myMat4.rot(member.rightX,member.rightY,member.rightZ,member.thetaUD);
						//myMat4.rot(member.topX,member.topY,member.topZ,member.thetaLR);
						//myMat4.rot(member.frontX,member.frontY,member.frontZ,member.thetaRoll);
					myMat4.storeTo(member.matAccumeNotRotated);

					myMat4.loadIdentity();
						//don't touch here
							myMat4.rot(member.rightX,member.rightY,member.rightZ,member.thetaUD);
							myMat4.rot(member.topX,member.topY,member.topZ,member.thetaLR);
							myMat4.rot(member.frontX,member.frontY,member.frontZ,member.thetaRoll);
						//

						const len = member.speed.length3D;
						const x = member.speed.x;const y = member.speed.y;const z = member.speed.z;
						const a=myMat4.arr;
						member.speed.x = a[0]*x+a[1]*y+a[2]*z+a[3];
						member.speed.y = a[4]*x+a[5]*y+a[6]*z+a[7];
						member.speed.z = a[8]*x+a[9]*y+a[10]*z+a[11];
						member.speed.normalize3D();
						member.speed.mag3D(len);

				}
			};
		};

		Object.defineProperty(myXYZMani,'accordingToKeyFlame',{value:accordingToKeyFlame});
		function accordingToKeyFlame(){

			return function(time){
			//touch from here

				if(false){
					//nothing
				
				}else if(gR == 1){
					myXYZ.rotate(0,0,1,0,-90)(time);
					myXYZ.translate(0.1,0,0)(time);
				}else if(gL == 1){
					myXYZ.rotate(0,0,1,0,90)(time);
					myXYZ.translate(-0.1,0,0)(time);
				}else if(gU == 1){
					myXYZ.rotate(1,0,0,0,0)(time);
					myXYZ.translate(0,0.1,0)(time);
				}else if(gD == 1){
					myXYZ.rotate(1,0,0,0,180)(time);
					myXYZ.translate(0,-0.1,0)(time);
				}else if(gA == 1){
					myXYZ.rotate(1,0,0,0,-90)(time);
				}else if(gZ == 1){
					myXYZ.rotate(1,0,0,0,90)(time);
				}else{
					 myXYZ.translate(0,0,1000)(time);
				}
			// to here
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

