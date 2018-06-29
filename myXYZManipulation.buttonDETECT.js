libFileRelationship.create('myXYZManipulation.buttonDETECT');
libFileRelationship.myXYZManipulation.relatedTo='myXYZManipulation';




	//for using under controlled space ship, follow to key board
/* */(function(){

//DETECT

const NONE = void 0;
let value=NONE;//initial value


//attach buttons after loading DOM
let counter = 0;
let collection;
const hoge = setInterval(funcHoge,10);
function funcHoge() {
	collection = document.getElementsByTagName('body');
	if(collection.length != 0 && 'myXYZManipulation' in window) {
		clearInterval(hoge);
//○		myXYZManipulation.buttonDETECT = { };
		Object.defineProperty(myXYZManipulation,'buttonDETECT',{get:function(){return value;},enumerable:false,configurable:false});
		addButtons();
	} else {
		if(++counter > 100) {
			clearInterval(hoge);
			console.error("Can't find a object 'myXYZManipulation' or a HTML element 'body'.");
		}
	}
};

const oInstances = { };
function createButtonDETECT(sName,left,top,text,sNamePlanet){
	const element = document.createElement('button');
	oInstances[sNamePlanet] = new ButtonDETECT(element,"red","white",sNamePlanet);
	element.style.position = 'absolute';
	element.style.left = left.toString() + 'px';
	element.style.top  = top.toString() + 'px';
	element.innerText = text;
	element.addEventListener('click',oInstances[sNamePlanet].click(),false);
	document.getElementsByTagName('body')[0].appendChild(element);
};

/**class**/
function ButtonDETECT(element,sColorON,sColorOFF,sNamePlanet){
	this.value = sNamePlanet;
	this.switch = false;
	this.element = element;
	this.switch = false;
	this.bgcolorON = sColorON;
	this.bgcolorOFF = sColorOFF;
	element.style.backgroundColor = this.bgcolorOFF;
};
ButtonDETECT.prototype.click = function(){
	const myself = this;
	return function() {
		if(myself.switch) {
			myself.turnOFF();
		} else {
			for(let name in oInstances) {
				oInstances[name].turnOFF();
			}
			myself.turnON();
		}
	};//return
};
ButtonDETECT.prototype.turnON = function() {
	value = this.value;
	this.switch = true;
	this.element.style.backgroundColor = this.bgcolorON;
};
ButtonDETECT.prototype.turnOFF = function(){
	value = NONE;
	this.switch = false;
	this.element.style.backgroundColor = this.bgcolorOFF;
};

function addButtons() {

	let args,left,top;

	const aButtonsDETECT = [
		//title text,value
		['Sun','sun'],
		['Mercury','mercury'],
		['Venus','venus'],
		['Earth','earth'],
		['Mars','mars'],
		['Jupiter','jupiter'],
		['Saturn','saturn'],
		['Uanus','uranus'],
		['Neptune','neptune'],
		['Pluto','pluto'],
		['Moon','moon'],
		['Direction','direction']
	];
	left = 600;
	top = 100;
	for(let ii in aButtonsDETECT) {
		args = aButtonsDETECT[ii];
		createButtonDETECT(args[0],left,ii * 20 + top,args[0],args[1]);
	}



};//addButtons

/* */})();

