libFileRelationship.create('extString');


String.prototype.toDetoxification = function(){
	var str = this.replace(/</,"&lt");
	return str;
};

