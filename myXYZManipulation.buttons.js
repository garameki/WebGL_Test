libFileRelationship.create('myXYZManipulation.buttons');
libFileRelationship.myXYZManipulation.relatedTo='myXYZManipulation';




	//for using under controlled space ship, follow to key board
/* */(function(){


//attach buttons after loading DOM
let counter = 0;
let collection;
const hoge = setInterval(funcHoge,10);
function funcHoge() {
	collection = document.getElementsByTagName('body');
	if(collection.length != 0 && 'myXYZManipulation' in window) {
		clearInterval(hoge);
		myXYZManipulation.button = { };
		addButtons();
	} else {
		if(++counter > 100) {
			clearInterval(hoge);
			console.error("Can't find a object 'myXYZManipulation' or a HTML element 'body'.");
		}
	}
};

const oInstances = { };
function createButtonONOFF(sName,left,top,text){
	const element = document.createElement('button');
//不要	const inst = new ButtonONOFF(element,"red","white");
	oInstances[sName] = new ButtonONOFF(element,"red","white");
	Object.defineProperty(myXYZManipulation.button,sName,{get:function(){return oInstances[sName].sw;},enumerable:true,configurable:false});
	element.style.position = 'absolute';
	element.style.left = left.toString() + 'px';
	element.style.top  = top.toString() + 'px';
	element.innerText = text;
	element.addEventListener('click',oInstances[sName].click(),false);
	document.getElementsByTagName('body')[0].appendChild(element);
};

/**class**/
function ButtonONOFF(element,sColorON,sColorOFF){
	this.element = element;
	this.switch = false;
	this.bgcolorON = sColorON;
	this.bgcolorOFF = sColorOFF;
	element.style.backgroundColor = this.bgcolorOFF;
};
ButtonONOFF.prototype.click = function(){
	const myself = this;
	return function() {
		if(myself.switch) {
			myself.turnOFF();
		} else {
			for(let name in myXYZManipulation.button) {
				oInstances[name].turnOFF();
			}
			myself.turnON();
		}
	};//return
};
ButtonONOFF.prototype.turnON = function() {
	this.switch = true;
	this.element.style.backgroundColor = this.bgcolorON;
};
ButtonONOFF.prototype.turnOFF = function(){
	this.switch = false;
	this.element.style.backgroundColor = this.bgcolorOFF;
};

function addButtons() {

	let args,left,top;

	const aButtonsONOFF = [
		['MZtoSun',600,100,'-Z to Sun'],
		['MZtoMercury',600,150,'-Z to Mercury'],
		['MZtoVenus',600,200,'-Z to Venus'],
		['MZtoEarth',600,250,'-Z to Earth'],
		['MZtoMars',600,300,'-Z to Mars'],
		['MZtoJupiter',600,350,'-Z to Jupiter'],
		['MZtoSaturn',600,400,'-Z to Saturn'],
		['MZtoUranus',600,450,'-Z to Uranus'],
		['MZtoNeptune',600,500,'-Z to Neptune'],
		['MZtoPluto',600,550,'-Z to Pluto'],
		['MZtoMoon',600,600,'-Z to Moon'],
		['MZtoDirection',600,700,'-Z to Direction']
	];
	left = 600;
	top = 100;
	for(let ii in aButtons) {
		args = aButtonsONOFF[ii];
		createButtonONOFF(args[0],left,ii * 20 + top,args[3]);
	}



};//addButtons

/* */})();

