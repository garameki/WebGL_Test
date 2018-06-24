	/**
	 * ˜f¯‚Ì‘å‚«‚³‚Æ¿—Ê‚ğŠi”[ collection of the size and the mass of planets
	 * @param {number} minifyGravity    mass x mififyGravity -> new 'mass' that you can get by 'earthMass = myFacts.planets.earth.mass' 
	 * 					The setter recalculate all mass of members in myFacts.planets
	 * @param {number} minifySize	is as same as above
	**/

/* */(function(){

	libFileRelationship.create('myFacts');

	myFacts = { };

	const minifyGravity = 1.0;	//0.001 ~ 1
	const minifySize    = 1.0;	//000000000000000000????????????


	const planets = {
		"sun":{
			"revRadius":0,
			"parent":"",
			"radius":695508*0.0001,
			"mass":1.9891e+9,
			"period":null

		},
		"jupiter":{
			"revRadius":77830e+4,
			"parent":"sun",
			"radius":69911,
			"mass":1.8986e+6,
			"period":11.85678

		},
		"saturn":{
			"revRadius":142700e+4,
			"parent":"sun",
			"radius":58232,
			"mass":5.683e+5,
			"period":29.42415

		},
		"uranus":{
			"revRadius":286900e+4,
			"parent":"sun",
			"radius":25362,
			"mass":86832,
			"period":83.74921

		},
		"neptune":{
			"revRadius":44960e+4,
			"parent":"sun",
			"radius":24622,
			"mass":102430,
			"period":163.7267

		},
		"earth":{
			"revRadius":14960e+4,
			"parent":"sun",
			"radius":6371,
			"mass":5973,
			"period":1.0

		},
		"venus":{
			"revRadius":10800e+4,
			"parent":"sun",
			"radius":6051,
			"mass":4868,
			"period":0.161596

		},
		"mars":{
			"revRadius":22790e+4,
			"parent":"sun",
			"radius":3390,
			"mass":641,
			"period":1.880751

		},
		"ganymede":{
			"revRadius":1070000,
			"parent":"jupiter",
			"radius":2631,
			"mass":148,
			"period":0.01960274

		},
		"titan":{
			"revRadius":1221930,
			"parent":"saturn",
			"radius":2576,
			"mass":134,
			"period":0.0436849315

		},
		"mercury":{
			"revRadius":5790e+4,
			"parent":"sun",
			"radius":2439,
			"mass":330,
			"period":0.240850
		},
		"callisto":{
			"revRadius":1883000,
			"parent":"jupiter",
			"radius":2410,
			"mass":107,
			"period":0.0457233

		},
		"io":{
			"revRadius":421600,
			"parent":"jupiter",
			"radius":1821,
			"mass":89,
			"period":0.004846575

		},
		"moon":{
			"revRadius":384400,
			"parent":"earth",
			"radius":1737,
			"mass":73,
			"period":0.07485397

		},
		"europa":{
			"revRadius":670900,
			"parent":"jupiter",
			"radius":1561,
			"mass":48,
			"period":0.009728767

		},
		"triton":{
			"revRadius":354800,
			"parent":"neptune",
			"radius":1353,
			"mass":21,
			"period":0.01610136986

		},
		"pluto":{
			"revRadius":591300,
			"parent":"sun",
			"radius":1185,
			"mass":13,
			"period":245.4306

		},
		"iapetus":{
			"revRadius":3560820,
			"parent":"saturn",
			"radius":736,
			"mass":2,
			"period":0.21734520547

		},
		"tethys":{
			"revRadius":294619,
			"parent":"saturn",
			"radius":533,
			"mass":0.62,
			"period":0.0051726

		},
		"mimas":{
			"revRadius":185404,
			"parent":"saturn",
			"radius":198,
			"mass":0.037,
			"period":0.0025808

		},
	};

	myFacts.planets = { };



	myFacts.planets.gravity = 9.8;
	let name;
	for(let name in planets){
		myFacts.planets[name] = { };
		if(planets[name].parent == "sun"){
			myFacts.planets[name].revRadius = planets[name].revRadius*0.001;
		} else {
			myFacts.planets[name].revRadius = planets[name].revRadius;
		}
		myFacts.planets[name].radius = planets[name].radius;
		myFacts.planets[name].mass = planets[name].mass;
		myFacts.planets[name].parent = planets[name].parent;
		myFacts.planets[name].period = planets[name].period;
	}


/* */})();


