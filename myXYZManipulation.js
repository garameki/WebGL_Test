libFileRelationship.create('myXYZManipulation');
libFileRelationship.myXYZManipulation.relatedTo='myMat4';
libFileRelationship.myXYZManipulation.relatedTo='myXYZ';
libFileRelationship.myXYZManipulation.relatedTo='myFacts';



	var drawStep = 10;//milli seconds

	let gg,pp;

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
			this.posX=0;//absolute coordinate
			this.posY=0;
			this.posZ=0;


			this.speedX = 0;//absolute coordinate
			this.speedY = 0;
			this.speedZ = 0;


			this.matAccume=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];//Identity
			this.matAccumeNotTranslated=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];//Identity
			this.matAccumeNotRotated=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];//Identity
var hoge = setInterval(function(){
	gg = document.getElementsByTagName('body')[0];
	if(gg){
		clearInterval(hoge);
		pp = document.createElement('p');
		pp.style.position = "absolute";
		pp.style.top = "0px";
		pp.style.left = "50px";
		pp.style.color = "white";
		gg.appendChild(pp);
		pp.innerText = "Hello World";
	}
},100);

		};
		myXYZ.inherits(Member);
		Member.prototype.updateAccumes = function(){
			//********** 視線の転回と移動に関する計算 ************

			//produce 3 matrices

			//1.produce matAccuemNotTranslated
			myMat4.load(this.matAccumeNotTranslated);
				myMat4.rot(0,1,0,gTurnAxY);//gTurnAx*...angle
				myMat4.rot(1,0,0,gTurnAxX);
				myMat4.rot(0,0,1,gTurnAxZ);
			myMat4.storeTo(this.matAccumeNotTranslated);

			//2.produce matAccrmeNotRotated
			myMat4.loadIdentity();
				myMat4.trans(-this.posX,-this.posY,-this.posZ);//これがなければいつも前に表示される
			myMat4.storeTo(this.matAccumeNotRotated);

			//3.produce matAccume(using myMat4 continuously)
			myMat4.multiArray(this.matAccumeNotTranslated);
			myMat4.storeTo(this.matAccume);

		};


		Member.prototype.updatePosition = function(){

			//All positions,velocities and forces are in absolute coordinate.

			//calc FORCE
			let sumFx = 0;//absolute coordinate
			let sumFy = 0;
			let sumFz = 0;
			const G = myFacts.planets.gravity;


			const aNames = ["saturn"];//,"jupiter","neptune","uranus","earth","mars","venus","mercury"];

			//spacecraft ... origin ( this.posX this.posY this.posZ )
			//target planet ... ( memT.x memT.y memT.z )
			let memT,dx,dy,dz,len,force;
			for(let ii in aNames){
				memT = myXYZTrigonometry[aNames[ii]];//absolute coordinate
				dx = memT.x - this.posX;
				dy = memT.y - this.posY;
				dz = memT.z - this.posZ;

				len = 1/Math.sqrt(dx*dx+dy*dy+dz*dz);
				force = -G * myFacts.planets[aNames[ii]].mass * len * len * 0.0001;
				sumFx -= force * len * dx;
				sumFy -= force * len * dy;
				sumFz -= force * len * dz;
			}
const memTSaturn = myXYZTrigonometry["saturn"];
if(pp)pp.innerHTML = "x:"+Math.floor(this.posX*100)/100+" y:"+Math.floor(this.posY*100)/100+" z:"+Math.floor(this.posZ*100)/100+"<br>"+
		     "x:"+Math.floor(this.speedX*100)/100+" y:"+Math.floor(this.speedY*100)/100+" z:"+Math.floor(this.speedZ*100)/100+"<br>"+
		     "x:"+Math.floor(sumFx*10000)+" y:"+Math.floor(sumFy*10000)+" z:"+Math.floor(sumFz*10000)+"<br>"+
		     "x:"+Math.floor(memTSaturn.x)+" y:"+Math.floor(memTSaturn.y)+" z:"+Math.floor(memTSaturn.z)+"<br>";


			//calc velocity vector スピードの計算
			this.speedX += gInjectLR + sumFx;
			this.speedY += gInjectUD + sumFy;
			this.speedZ += gInjectFB + sumFz;



			this.posX += this.speedX;
			this.posY += this.speedY;
			this.posZ += this.speedZ;

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

				for(var ii=0;ii<n;ii++){

					member.updateAccumes();

					member.updatePosition();


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

