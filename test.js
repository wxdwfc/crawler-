

/*
 * The model for constructing the web page.
 */
var jsdom = require('jsdom').jsdom;

var fs = require('fs');
var jquery = fs.readFileSync("./jquery.js", "utf-8");
var underscore   = require('underscore');

var nodegrass = require("../nodegrass");
var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});

var Game = require("./_Game.js").Game;

var Start_server = require("./Webserver.js").Start_server;

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
var dataSet  =  {
				"name": "test_douyu"
   				,"children":[]
   				,"url":base_url
   				};

/*
 * compute the hotness change of between 2 crawaler.
 */
var origin = {};
var next   = {};
var finished = 0;


var interval = 10000; //10 seconds
var repeat   = false;

var test_page = false;

//add proxies
nodegrass.addProxy("cache.sjtu.edu.cn",8080);
nodegrass.addProxy("118.67.124.120",80);
nodegrass.proxy.shift();
/**
  * The starter function.
  */
if (!test_page) {

	nodegrass.get(target_url,
		function(data,status,headers) {
			make_dom(data,root_callback);
			Start_server();

			wss.on('connection', function(ws) {
    			ws.on('message', function(message) {
//	        		console.log("get something");
	        		getDataSet();
        			ws.send(JSON.stringify(dataSet));
        			//ws.close();
		   		});

			});
		} ,"utf-8").on("error",
		function(e) {

			console.log("Err: " + e.message);
		}
	);
} else {
	// just testing the webpage view
	Start_server();
}


/*
 * make a dom from a pure string flow
 */

function make_dom(html, callback,params) {
  jsdom.env({
    html: html,
    src: [jquery],
    done: function (errors, window) {
      if(errors) {
      	console.log("error: " + errors);
      	return;
      }
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
	try{
		var ul = games.children[0];
	}catch(err) {
		console.log("root_callback error: " + err.message);
		next = {};
		if(repeat)
			setTimeout(tick ,interval);
		return;
	}

	for(var i = 0;i < ul.children.length - 1;++i){
		var temp = ul.children[i].children[0];
		catagory.push(new Game(temp.title,temp.href.substr(7)));

	}
	//console.log(catagory);
	startExtract();

}

function startExtract() {

	finished = 0;

	catagory.map(function(x) {

		var name = x.name;
		var url  = base_url + x.link;

		nodegrass.get(url,
			function(data,status,headers) {
			make_dom(data,extractData,[name]);

		} ,"utf-8").on("error",
		function(e) {
			console.log("Err: " + e.message);}
		);

	});

}


function extractData(errors,$,params,window) {

	var type = params[0];
	var temp = {};

	var divs = $('.mes');

	for(var i = 0;i < divs.length;++i){

		var title = underscore($(divs.get(i).children[0]).html()).unescape();
		var content = divs.get(i).children[1];

		var views = $(content.children[0]).html();
		var name  = underscore($(content.children[1]).html()).unescape();

		// i made a simple assumption that title will not collide
		temp[title] = {
			"hotness":convert(views),
			"name":name,
			"link":""
			 };

	}
//	console.log(temp);
    var links = $(".list");
	for(var i = 0;i < links.length;++i){
		//console.log(links.get(i).title);
		temp[links.get(i).title]["link"] = links.get(i).href.substr(7);
	}

	//dataSet["children"].push(temp);
	next[type] = temp;
	finished += 1;

	if (finished == catagory.length) {
		swap();
	}

}

/*
 * convert the string to number.
 */
function convert(s){

	if(s[s.length - 1] == '万'){

		return parseFloat(s) * 20000;
	} else {
		return parseInt(s);
	}
}


/*
 * The tick function will be called at a given interval to flush the data.
 */
function tick() {
	console.log("tick");
	nodegrass.get(target_url,

		function(data,status,headers) {
			make_dom(data,root_callback);

		} ,"utf-8").on("error",
		function(e) {

			console.log("Err: " + e.message);
		}
	);

}

function getDataSet() {

	dataSet.children = [];
	for (var game in origin) {

		var array = [];
		for(var title in origin[game]) {
			array.push(
			{
				"title":title,
				"name" : origin[game][title].name,
				"hotness": origin[game][title].hotness,
				"link":origin[game][title].link
			});
		}
		dataSet.children.push(
		{
			"name": game,
			"children": array
		});
	}


}

function swap() {

	console.log("swap");
	origin = next;
	next = {};

	if(repeat)
		setTimeout(tick ,interval);

}

