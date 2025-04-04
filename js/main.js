//execute script when window is loaded
window.onload = function() {

    //SVG dimension variables
    var w = 900,
        h = 500;

    //container block
    var container = d3.select("body") //select the body element
        .append("svg") //append an svg element
        .attr("width", w) //set width
        .attr("height", h) //set height
        .attr("class", "container") //set class name
        .style("background-color", "rgba(0,0,0,0.2)"); //light transparent background

    //inner rectangle block
    var innerRect = container.append("rect") //append rectangle to svg
        .datum(400) //bind datum to it
        .attr("width", function(d) {
            return d * 2; //width: 800
        })
        .attr("height", function(d) {
            return d; //height: 400
        })
        .attr("class", "innerRect") //assign class
        .attr("x", 50) //position from left
        .attr("y", 50) //position from top
        .style("fill", "#FFFFFF"); //fill color
};
