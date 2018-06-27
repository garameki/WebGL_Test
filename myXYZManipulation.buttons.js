libFileRelationship.create('myXYZManipulation.buttons');
libFileRelationship.myXYZManipulation.relatedTo='myXYZManipulation';




	//for using under controlled space ship, follow to key board
/* */(function(){

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
function createButtonONOFF(sName,left,top,text){
	const element = document.createElement('button');
	const inst = new ButtonONOFF(element,"red","white");
	Object.defineProperty(myXYZManipulation.button,sName,{value:inst,writable:false,enumerable:true,configurable:false});
	element.style.position = 'absolute';
	element.style.left = left.toString() + 'px';
	element.style.top  = top.toString() + 'px';
	element.innerText = text;
	element.addEventListener('click',inst.click(),false);
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
				myXYZManipulation.button[name].turnOFF();
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
Object.defineProperty(ButtonONOFF.prototype,'sw',{get:function(){return this.switch;},enumerable:false,configurable:false});//getterを使いたいがためにthisを使ってる

function addButtons() {


	const aButtons = [
		['MZtoPlanet',600,100,'-Z to Earth'],
		['PXtoDirection',600,200,'+X to Direction']
	];
	let args;
	for(let ii in aButtons) {
		args = aButtons[ii];
		createButtonONOFF(args[0],args[1],args[2],args[3]);
	}

/*
	eleMZtoPlanet = createButton(600,100,'-Z to Earth',funcMZtoEarth());
	function funcMZtoEarth() {
		let sw = false;
		let bgcolor = "white";
		return function() {
			if(sw) {
				sw = false;
				bgcolor = "white";
			} else {
				sw = true;
				bgcolor = "red";
			}
			eleMZtoPlanet.style.backgroundColor = bgcolor;
		};
	};

	elePXtoDirection = createButton(600,100,'+X to Direction',funcPXtoDirection());
	function funcPXtoDirection() {
		let sw = false;
		let bgcolor = "white";
		return function() {
			if(sw) {
				sw = false;
				bgcolor = "white";
			} else {
				sw = true;
				bgcolor = "red";
			}
			elePXtoDirection.style.backgroundColor = bgcolor;
		};
	};
*/

/*
		swMZtoPlanet=!swMZtoPlanet;eleMZtoPlanet.backgroundColor=
	};
	document.createElement('button');
	eleMZtoPlanet.style.position = 'absolute';
	eleMZtoPlanet.style.left = '600px';
	eleMZtoPlanet.style.top  = '100px';
	eleMZtoPlanet.innerText = "-Z to Earth";
	eleMZtoPlanet.addEventListener('click',function(){},false);
	collection[0].appendChild(eleMZtoPlanet);

	elePXtoDirection = document.createElement('button');
	elePXtoDirection.style.position = 'absolute';
	elePXtoDirection.style.left = '600px';
	elePXtoDirection.style.top  = '200px';
	elePXtoDirection.innerText = "+X to Direction";
	elePXtoDirection.addEventListener('click',function(){swPXtoDirection=!swPXtoDirection;},false);
	collection[0].appendChild(elePXtoDirection);
*/
};//addButtons

/* */})();

