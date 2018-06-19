	/**
	 * ˜f¯‚Ì‘å‚«‚³‚ÆŽ¿—Ê‚ðŠi”[ collection of the size and the mass of planets
	 * @param {number} minifyGravity    mass x mififyGravity -> new 'mass' that you can get by 'earthMass = myFacts.planets.earth.mass' 
	 * 					The setter recalculate all mass of members in myFacts.planets
	 * @param {number} minifySize	is as same as above
	**/

/* */(function(){

	libFileRelationship.create('myFacts');

	myFacts = { };

	//'emumerable' property is very sufficient to fix bugs!!!!

	let minifyGravity=1.0;//0.001 ~ 1
	let minifySize=1.0;//000000000000000000????????????


	Object.defineProperty(myFacts,'planets',{value:{ },writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myFacts.planets,'minifyGravity',{
		get:function(){return minifyGravity;},
		set:function(nn){
			minifyGravity=nn;
			for(let member in myFacts.planets)myFacts.planets[member].renewMass();
		},
		enumerable:false,configurable:false
	});

	Object.defineProperty(myFacts.planets,'minifySize',{
		get:function(){return minifySize;},
		set:function(nn){
			minifySize=nn;
			for(let member in myFacts.planets)myFacts.planets[member].renewRadius();
		},
		enumerable:false,configurable:false
	});

	Object.defineProperty(myFacts.planets,'exports',{
		set:function(sName){
			Object.defineProperty(myFacts.planets,sName,{value:new Planet(sName),writable:false,enumerable:true,configurable:false});
		},
		enumerable:false,configurable:false
	});

	//class
	function Planet(sName){
			this.name = sName;
			this.rr;//radius
			this.mm;//mass
			this.revrr;//average revolution radius
			this.rr_now;
			this.mm_now;
			this.revrr_now;
	};
	Object.defineProperty(Planet.prototype,'radius',{
		get:function(){return this.rr_now;},
		set:function(nn){this.rr = nn;this.rr_now = nn * minifySize},
		enumerable:false,configurable:false
	});
	Object.defineProperty(Planet.prototype,'mass',{
		get:function(){return this.mm_now;},
		set:function(nn){this.mm = nn;this.mm_now = nn * minifyGravity},
		enumerable:false,configurable:false
	});
	Object.defineProperty(Planet.prototype,'revRadius',{
		get:function(){return this.revrr_now;},
		set:function(nn){this.revrr = nn;this.revrr_now = nn * minifySize},
		enumerable:false,configurable:false
	});
	Planet.prototype.renewRadius = function(){
		this.rr_now = this.rr * minifySize;
		this.revrr_now = this.revrr * minifySize;
	};
	Planet.prototype.renewMass = function(){
		this.mm_now = this.mm * minifyGravity;
	};
	

	const planets = {
		"sun":{
			"revRadius":0,
			"parent":"",
			"radius":695508,
			"mass":1.9891e+9
		},
		"jupiter":{
			"revRadius":77830e+4,
			"parent":"sun",
			"radius":69911,
			"mass":1.8986e+6
		},
		"saturn":{
			"revRadius":142700e+4,
			"parent":"sun",
			"radius":58232,
			"mass":5.683e+5
		},
		"uranus":{
			"revRadius":286900e+4,
			"parent":"sun",
			"radius":25362,
			"mass":86832
		},
		"neptune":{
			"revRadius":44960e+4,
			"parent":"sun",
			"radius":24622,
			"mass":102430
		},
		"earth":{
			"revRadius":14960e+4,
			"parent":"sun",
			"radius":6371,
			"mass":5973
		},
		"venus":{
			"revRadius":10800e+4,
			"parent":"sun",
			"radius":6051,
			"mass":4868
		},
		"mars":{
			"revRadius":22790e+4,
			"parent":"sun",
			"radius":3390,
			"mass":641
		},
		"ganymede":{
			"revRadius":1070000,
			"parent":"jupiter",
			"radius":2631,
			"mass":148
		},
		"titan":{
			"revRadius":1221930,
			"parent":"saturn",
			"radius":2576,
			"mass":134
		},
		"mercury":{
			"revRadius":5790e+4,
			"parent":"sun",
			"radius":2439,
			"mass":330
		},
		"kallisto":{
			"revRadius":1883000,
			"parent":"jupiter",
			"radius":2410,
			"mass":107
		},
		"io":{
			"revRadius":421600,
			"parent":"jupiter",
			"radius":1821,
			"mass":89
		},
		"moon":{
			"revRadius":384400,
			"parent":"earth",
			"radius":1737,
			"mass":73
		},
		"europa":{
			"revRadius":670900,
			"parent":"jupiter",
			"radius":1561,
			"mass":48
		},
		"triton":{
			"revRadius":354800,
			"parent":"neptune",
			"radius":1353,
			"mass":21
		},
		"pluto":{
			"revRadius":591300,
			"parent":"sun",
			"radius":1185,
			"mass":13
		},
		"iapetus":{
			"revRadius":3560820,
			"parent":"saturn",
			"radius":736,
			"mass":2
		},
		"tethys":{
			"revRadius":294619,
			"parent":"saturn",
			"radius":533,
			"mass":0.62
		},
		"mimas":{
			"revRadius":185404,
			"parent":"saturn",
			"radius":198,
			"mass":0.037
		},
	};
const aa = 0.001;
	myFacts.planets.minifyGravity = 1.0;
	myFacts.planets.minifySize = aa;

	myFacts.planets.gravity = 9.8;


	let name;
	for(let name in planets){
		myFacts.planets.exports = name;
		myFacts.planets[name].revRadius = planets[name].revRadius;
		myFacts.planets[name].radius = planets[name].radius;
		myFacts.planets[name].mass = planets[name].mass;
		myFacts.planets[name].parent = planets[name].parent;
	}


/* */})();


