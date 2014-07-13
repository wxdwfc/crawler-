exports.Game = Game;

function Game( name,url){

	this.name = name;
	this.link = url;

	this.descript = "name: " + this.name + " ; " + "link: " + this.link;
}

Game.prototype.print = function () { console.log(this.descript);};