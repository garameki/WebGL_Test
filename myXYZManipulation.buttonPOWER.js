libFileRelationship.create('myXYZManipulation.buttonPOWER');
libFileRelationship.myXYZManipulation.relatedTo='myXYZManipulation';

//exclusive swiches


	//for using under controlled space ship, follow to key board
/* */(function(){


// POWER
let value;

//attach buttons after loading DOM
let counter = 0;
let collection;
const hoge = setInterval(funcHoge,10);
function funcHoge() {
	collection = document.getElementsByTagName('body');
	if(collection.length != 0 && 'myXYZManipulation' in window) {
		clearInterval(hoge);
		Object.defineProperty(myXYZManipulation,'buttonPOWER',{get:function(){return value;},enumerable:true,configurable:false});
		addButtons();
	} else {
		if(++counter > 100) {
			clearInterval(hoge);
			console.error("Can't find a object 'myXYZManipulation' or a HTML element 'body'.");
		}
	}
};

const oInstances = { };
function createButtonPOWER(sName,left,top,text,power){
	const element = document.createElement('button');
	oInstances[sName] = new ButtonPOWER(element,"red","white",power);
	element.style.position = 'absolute';
	element.style.left = left.toString() + 'px';
	element.style.top  = top.toString() + 'px';
	element.innerText = text;
	element.addEventListener('click',oInstances[sName].click(),false);
	document.getElementsByTagName('body')[0].appendChild(element);
};

/**class**/
function ButtonPOWER(element,sColorON,sColorOFF,power){
	this.value = power;
	this.element = element;
	this.bgcolorON = sColorON;
	this.bgcolorOFF = sColorOFF;
	element.style.backgroundColor = this.bgcolorOFF;
};
ButtonPOWER.prototype.click = function(){
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
ButtonPOWER.prototype.turnON = function() {
	value = this.value;
	this.element.style.backgroundColor = this.bgcolorON;
};
ButtonPOWER.prototype.turnOFF = function(){
	value = 0;
	this.element.style.backgroundColor = this.bgcolorOFF;
};

function addButtons() {

	let args,left,top;

	const aButtonsPOWER = [
		['Maximum','for So Far Planets',1],
		['High','for Far Planets',0.1],
		['Middle','for Near Planets',0.01],
		['Low','Nearby planet',0.001],
		['Minimum','Adjust orbital',0.0001]
	];
	left = 800;
	top = 100;
	for(let ii in aButtonsPOWER) {
		args = aButtonsPOWER[ii];
		createButtonPOWER(args[0],left,ii * 20 + top,args[1],args[2]);
	}



};//addButtons

/* */})();

