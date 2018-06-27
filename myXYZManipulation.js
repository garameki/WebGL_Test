﻿libFileRelationship.create('myXYZManipulation');
libFileRelationship.myXYZManipulation.relatedTo='myMat4';
libFileRelationship.myXYZManipulation.relatedTo='myXYZ';
libFileRelationship.myXYZManipulation.relatedTo='myFacts';
libFileRelationship.myXYZManipulation.relatedTo='myVec3';
libFileRelationship.myXYZManipulation.relatedTo='myXYZRevolutions';




	let gg,pp;

	//for using under controlled space ship, follow to key board
	(function(){
		/** global scope **/
		myXYZManipulation = myXYZMani = { };

		Object.defineProperty(myXYZManipulation,'detect',{value:detect,writable:false,enumerable:false,configurable:false});
		function detect(){
			swDetect = !swDetect;
		};

		//info window --- I cant make this external function!!
		let Info;
		const hoge = setInterval(func(700,100,"black"),10);
		function func(left,top,color) {
			let collection;
			let counter = 0;
			return function() {
				collection = document.getElementsByTagName('body');
				if(collection.length == 0) {
					if(++counter>100) {
						clearInterval(hoge);
						console.error("body not found.");
					}
				} else {
					clearInterval(hoge);
					Info = document.createElement('p');
					Info.style.position = 'absolute';
					Info.style.left = left.toString()+'px';
					Info.style.top = top.toString()+'px';
					Info.style.color = color;
					collection[0].appendChild(Info);
				}
			};
		};


		function tos(num) {
			return (Math.floor(num*1000)/1000).toString();
		};

		//differential
		const dTurn = Math.PI/180/60;//radian per 1 second besed on which 1 rotation takes 1 minute
		const dInject = 0.0001;// must make unit [Newton]

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

		//for Buttons
		let swMZtoPlanet = false;
		let swPXtoDirection = false;

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

		};
		myXYZ.inherits(Member);
		Member.prototype.updateAccumes = function(){
			//********** キーによる視線の転回に関する計算 ************

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


		let posXBefore=0;
		let posYBefore=0;
		let posZBefore=0;
		Member.prototype.updatePosition = function(){
			//key accelaration and gravity accelaration in absolute coordinate.
			//キーによる加速の計算と重力による加速の計算

			//calc FORCE
			let sumFx = 0;//absolute coordinate
			let sumFy = 0;
			let sumFz = 0;
			const G = myFacts.planets.gravity;


			//●const aNames = ["saturn","jupiter","neptune","uranus","earth","mars","venus","mercury"];
			const aNames = [];//["earth"];
			//spacecraft ... origin ( this.posX this.posY this.posZ )
			//target planet ... ( memT.x memT.y memT.z )
			let memT,dx,dy,dz,len,force;
			for(let ii in aNames){
				memT = myXYZRevolutions[aNames[ii]];//absolute coordinate
				dx = this.posX - memT.x;
				dy = this.posY - memT.y;
				dz = this.posZ - memT.z;

				len = 1/Math.sqrt(dx*dx+dy*dy+dz*dz);
				force = -G * myFacts.planets[aNames[ii]].mass * len * len;
				sumFx += force * len * dx;
				sumFy += force * len * dy;
				sumFz += force * len * dz;
			}

			//calc injection force This force is on relative coordinate,so that this must be converted onto absolute coordinate
			let ix = gInjectLR;
			let iy = gInjectUD;
			let iz = gInjectFB;
			let ai = this.matAccumeNotTranslated;
			let injx = ai[0]*ix+ai[1]*iy+ai[2]*iz+ai[3];
			let injy = ai[4]*ix+ai[5]*iy+ai[6]*iz+ai[7];
			let injz = ai[8]*ix+ai[9]*iy+ai[10]*iz+ai[11];

			//calc velocity vector
			this.speedX += injx + sumFx;
			this.speedY += injy + sumFy;
			this.speedZ += injz + sumFz;
			this.posX += this.speedX;
			this.posY += this.speedY;
			this.posZ += this.speedZ;


//			Info.innerHTML = "<br> posDX:"+(this.posX-posXBefore).toString()+"<br>posDY:"+(this.posY-posYBefore).toString()+"<br>posDZ:"+tos(this.posZ-posZBefore);

			posXBefore = this.posX;
			posYBefore = this.posY;
			posZBefore = this.posZ;
		};


		
		Member.prototype.updateMZtoPlanet = function () {
			//a little bit rotation every 1 second 1秒ごとの回転処理

			// make the Earth be in gaze onto -Z axisの-Z軸方向を地球に向ける

			//元の方向ベクトル(0 0 -1)の現在の向きを求める
			const mat = this.matAccumeNotTranslated;
			const vecMZ = [-mat[2],-mat[6],-mat[10]];

			Info.innerHTML = tos(vecMZ.x)+" "+tos(vecMZ.y)+" "+tos(vecMZ.z)+"<br>";

			//spacecraftから見た地球の方向ベクトルを求める
			const ve = [myXYZRevolutions["earth"].x - this.posX,myXYZRevolutions["earth"].y - this.posY,myXYZRevolutions["earth"].z - this.posZ];

			//spacecraftの現在の-Z軸の方向と地球の方向との内角を求める
			vecMZ.normalize3D();
			ve.normalize3D();
			const angleRad = Math.acos(myVec3.dot(vecMZ,ve));// in radians , arguments must be normal




//			Info.innerHTML += Math.floor(angleRad*180/3.141592653*1000)/1000;
			Info.innerHTML = "<br>ve.x:"+tos(Math.floor(ve.x*100)/100)+"<br>ve.y:"+tos(Math.floor(ve.y*100)/100)+"<br>ve.z:"+tos(Math.floor(ve.z*100)/100);


			let axis,angle;
			//既に地球に向いている時は計算しない
			if(Math.abs(angleRad)>0.01) {
				//spacecraftの現在の-Z軸方向を地球の方向に向けるときの回転軸を求める
				axis = myVec3.cross(ve,vecMZ);
				angle = Math.min(dTurn,angleRad) ;

			} else {
				axis = [1,1,1];
				angle = 0;
			}

			//matAccumeに加える
			myMat4.load(this.matAccume);
			myMat4.rot(axis[0],axis[1],axis[2],angle);
			myMat4.storeTo(this.matAccume);

			//matAccumeNotTranslatedに加える
			myMat4.load(this.matAccumeNotTranslated);
			myMat4.rot(axis[0],axis[1],axis[2],angle);
			myMat4.storeTo(this.matAccumeNotTranslated);


		};


		Member.prototype.updatePXtoDirection = function () {
			//a little bit rotation every 1 second 1秒ごとの回転処理


			//spacecraftの進行方向のベクトルを求める
			const vecDirection = [this.posX - positionBefore[0],this.posY - positionBefore[1],this.posZ - positionBefore[2]];

			//元の方向ベクトル(1 0 0)の現在の向きvecXを求める
			const mat = this.matAccumeNotTranslated;
			const vecPX = [mat[0],mat[4],mat[8]];

			//spacecraftの現在のX軸の方向と進行方向との内角を求める
			vecPX.normalize3D();
			vecDirection.normalize3D();
			const angleRad = Math.acos(myVec3.dot(vecPX,vecDirection));// in radians, arguments must be normal

			let axis,angle;
			if(Math.abs(angleRad)>0.01) {
				//回転軸を求める
				axis = myVec3.cross(vecDirection,vecPX);
				angle = Math.min(dTurn,angleRad) ;
			} else {
				axis = [1,1,1];
				angle = 0;
			}

			//matAccumeに加える
			myMat4.load(this.matAccume);
			myMat4.rot(axis[0],axis[1],axis[2],angle);
			myMat4.storeTo(this.matAccume);

			//matAccumeNotTranslatedに加える
			myMat4.load(this.matAccumeNotTranslated);
			myMat4.rot(axis[0],axis[1],axis[2],angle);
			myMat4.storeTo(this.matAccumeNotTranslated);
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
		Object.defineProperty(myXYZManipulation,'member',{get:function(){return hero;},enumerable:true,configurable:false});

	
	
		let positionBefore;
		//一秒に一回の描画
		Object.defineProperty(myXYZMani,'move',{value:move(hero)});
		function move(member){//member === hero
			var sumRemain=0;
			return function(timeDiff_minute){//Whether virtual time or real time, it's none of this calculation. The quantity of time span is only important.
				sumRemain+=timeDiff_minute;
				var n = Math.floor(sumRemain);// a number of translation of the spacecraft
				sumRemain=sumRemain - n;

				for(var ii=0;ii<n*60;ii++){

					member.updateAccumes();

					member.updatePosition();

					if(myXYZManipulation.button.MZtoPlanet.sw)member.updateMZtoPlanet();
					if(myXYZManipulation.button.PXtoDirection.sw)member.updatePXtoDirection();

					positionBefore = [member.posX,member.posY,member.posZ];

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

