// Execute script when window is loaded
window.onload = function() {

    // SVG dimension variables
    var w = 900,
        h = 500;

    // SVG container block
    var container = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "container")
        .style("background-color", "rgba(0,0,0,0.2)");

    // Inner white rectangle block
    var innerRect = container.append("rect")
        .datum(400)
        .attr("width", function(d) { return d * 2; }) // 800
        .attr("height", function(d) { return d; })    // 400
        .attr("class", "innerRect")
        .attr("x", 50)
        .attr("y", 50)
        .style("fill", "#FFFFFF")
        .style("stroke", "none");

    // City population array
    var cityPop = [
        { city: 'Madison', population: 233209 },
        { city: 'Milwaukee', population: 594833 },
        { city: 'Green Bay', population: 104057 },
        { city: 'Superior', population: 27244 }
    ];

    // Circle block – data join
    var circles = container.selectAll(".circles")
        .data(cityPop)
        .enter()
        .append("circle")
        .attr("class", "circles")
        .attr("id", function(d) {
            return d.city;
        })
        .attr("r", function(d) {
            // Calculate radius based on population area
            var area = d.population * 0.01;
            return Math.sqrt(area / Math.PI);
        })
        .attr("cx", function(d, i) {
            // Space out circles horizontally using index
            return 90 + (i * 180);
        })
        .attr("cy", function(d) {
            // Grow circles upward by subtracting from 450
            return 450 - (d.population * 0.0005);
        });
};
