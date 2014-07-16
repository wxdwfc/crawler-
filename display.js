var diameter = null;
var format = null;
var pack = null;
var svg = null;

var info = null;
var rect = null;
var wording1 = null;
var wording2 = null;
var wording3 = null;

var width = 0;
var height = 0;


var base_url = "";

function init_scene() {

	diameter = 960,
    	format = d3.format(",d");
    width = height = diameter;

	pack = d3.layout.pack()
    	.size([diameter - 4, diameter - 4])
	    .value(function(d) { return d.hotness; });

	svg = d3.select("body").append("svg")
    	.attr("width", diameter)
	    .attr("height", diameter)
	  .append("g")
      .attr("transform", "translate(2,2)");	
    d3.select(self.frameElement).style("height", diameter + "px");
}

function render(root) {

	  base_url = root["url"];

	  var node = svg.datum(root).selectAll(".node")
      	.data(pack.nodes)
	    .enter().append("g")
     	.attr("class", function(d) { return d.children ? "node" : "leaf node"; })
    	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	  node.append("title")
        .text(function(d) { return d.name + (d.children ? "" : ": " + format(d.hotness)); });

	  node.append("circle")
     	  .attr("r", function(d) { return d.r; });

	  node.filter(function(d) { return !d.children; }).append("text")
    	  .attr("dy", ".3em")
	      .style("text-anchor", "middle")
    	  .text(function(d) { return d.name.substring(0, d.r / 3); });

     
   	  info = svg.append('g').attr('class', 'info');
 	  
      rect = info.append('rect')
	  .attr('class', 'info-border')
	  .attr('width', 210)
	  .attr('height', 50)
	  .attr('rx', 10)
	  .attr('ry', 10);
 
	  wording1 = info.append('text')
	  .attr('class', 'info-text')
	  .attr('x', 10)
	  .attr('y', 20)
	  .text('');
 
	  wording2 = info.append('text')
	  .attr('class', 'info-text')
	  .attr('x', 10)
	  .attr('y', 40)
	  .text('');


	  wording3 = info.append('text')
	  .attr('class', 'info-text')
	  .attr('x', 10)
	  .attr('y', 60)
	  .text('');



	  //add mouse react

	   node.filter(function(d) { return !d.children; }).on('mouseover', function(d) {
	   	// child node
	

	    wording1.text("标题: " + d.title);
	    wording2.text("主播: " + d.name);
	    wording3.text("人数: " + d.hotness);
	    
	    rect.attr("height",80);
		d3.select('.info')
	      .attr('transform', 'translate(' + width - 210 + ',' + 100 + ')');
      	//display information
      	d3.select('.info').style('display', 'block');
      
  	   })
	   .on('mouseout', function() {
    	d3.select('.info').style('display', 'none');
    	rect.attr("height",50);
	   }).on("click",function(d) {
			window.open(base_url + d.link, "_blank")
	   });

	   // for larger words
	    node.filter(function(d) { return d.children; }).on('mouseover', function(d) {

	    wording1.text("游戏: " + d.name);
	    wording2.text("");
	    wording3.text("");

		d3.select('.info')
	      .attr('transform', 'translate(' + width - 210 + ',' + 100 + ')');
      	//display information
      	d3.select('.info').style('display', 'block');
	    });

}


/*
 * clear the whole pictures.
 */
function remove(){

	var circles = svg.selectAll("circle")
	    .data([]);
	circles.exit().remove();

	var texts = svg.selectAll("text").data([]);
	texts.exit().remove();

	var info = svg.selectAll('.info').data([]);
	tips.exit().remove();

}