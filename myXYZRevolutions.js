libFileRelationship.create('myXYZRevolutions');
libFileRelationship.myXYZRevolutions.relatedTo='myXYZ';
libFileRelationship.myXYZRevolutions.relatedTo='myMat4';

//for using trigonometric functions
/* */(function(){//xyz follow to trigonometric functions

/** global scope **/
myXYZRevolutions = { };

// real           screen
//one hour ----- one year
//3600000ms----- 360°(earth) 
//			[°]/[h] * [rad]/[°] * [ms]/[h]
const anglePerHour = (360)*(Math.PI/180)/(1000*60*60);//[rad/ms]----1 sidereal period of earth per real time 1 hour
const radPerHour = Math.PI/180/365/24/60   //1年で1周するときに1時間で何ラジアン回転するか

/** inner class **/
/**
 * @param {Number} period ... earth = 1.000000 sidereal period based on one of the Earth 公転周期
**/
var Member = function(r_xy,r_z,period){
	myXYZ.SuperMember.call(this);
	this.rxy = r_xy;//radius on x-y plane
	this.rz = r_z;//radius on (x or y)-z plane
	this.frequency = radPerHour/period;//公転角速度real timeの411msでradPerHour°回転する
	this.alpha = 2*3.14*Math.random();
	this.gamma = 2*3.14*Math.random();
};
myXYZ.inherits(Member);
//@override
Member.prototype.reposition = function(vTime_total){
	this.x=this.rxy * Math.cos(this.frequency * vTime_total + this.alpha);
	this.y=this.rxy * Math.sin(this.frequency * vTime_total + this.alpha);
	this.z=this.rz  * Math.sin(this.frequency * vTime_total + this.gamma);
};

const TRUE = true;
/** outer functions **/
Object.defineProperty(myXYZRevolutions,'createMember',{value:createMember,writable:false,enumerable:false,configurable:false});
function createMember(sName,r_xy,r_z,period){
	var member = new Member(r_xy,r_z,period);
	Object.defineProperty(myXYZRevolutions,sName,{value:member,writable:false,enumerable:TRUE,configurable:false});
	return member;
};
Object.defineProperty(myXYZRevolutions,'reposAll',{value:repositionizeAllMembers(),writable:false,enumerable:false,configurable:false});
function repositionizeAllMembers(){
	return function(vTime_total){
		for(let name in myXYZRevolutions){
			myXYZRevolutions[name].reposition(vTime_total);
		}
	};
};

/* */})();//trigonometric functionsotion
