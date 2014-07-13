

/*
 * The model for constructing the web page.
 */
var jsdom = require('jsdom').jsdom;

var fs = require('fs');
var jquery = fs.readFileSync("./jquery.js", "utf-8");

var nodegrass = require("nodegrass");

var Game = require("./_Game.js").Game;
var BaseData = require("./BaseData.js").BaseData;

/**
  * local variables
  *--------------------------------------
**/

/*	
 * The base url to fetch all the games.	
*/
var target_url = "http://www.douyutv.com/directory/game/How";
var base_url   = "http://www.douyutv.com";

/*	
 * The catagories for the games.
*/
var catagory =  [];
var dataSet  =  {};


nodegrass.get(target_url,
	function(data,status,headers) {
		makeDom(data,root_callback);

	} ,"utf-8").on("error",
	function(e) {

		console.log("Err: " + e.message);
	}
);


/*
 * make a dom from a pure string flow
 */

function makeDom(html, callback,params) {
  jsdom.env({
    html: html,
    src: [jquery],
    done: function (errors, window) {
      var $ = window.$;

      callback(errors,window.$,params);

      window.close();

    }
  });
}


/*
 * root callback for extract games
 */
function root_callback(errors,$,params) {

	var games = $('.tagCont')[0];
	var ul = games.children[0];

	for(var i = 0;i < ul.children.length - 1;++i){
		var temp = ul.children[i].children[0];
		catagory.push(new Game(temp.title,temp.href.substr(7)));
		dataSet[temp.title] = [];
		break;
	}
	//console.log(catagory);
	startExtract();

}

function startExtract() {

	catagory.map(function(x) {

		var name = x.name;
		var url  = base_url + x.link;

		nodegrass.get(url,
			function(data,status,headers) {
			makeDom(data,extractData,[name]);

		} ,"utf-8").on("error",
		function(e) {
			console.log("Err: " + e.message);}
		);

	});

}


function extractData(errors,$,params,window) {

	var type = params[0];

	var divs = $('.mes');

	for(var i = 0;i < divs.length;++i){

		var title = $(divs.get(i).children[0]).html();
		var content = divs.get(i).children[1];

		var views = $(content.children[0]).html();
		var name  = $(content.children[1]).html();
		var d = new BaseData(title,type,name,convert(views));
		console.log(d);

	}

}

/*
 * convert the string to number.
 */
function convert(s){

	if(s[s.length - 1] == '万'){

		return parseFloat(s) * 10000;
	} else {
		return parseInt(s);
	}
}

