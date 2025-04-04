// Execute script when window is loaded
window.onload = function() {

    // SVG dimension variables
    var w = 900,
        h = 500;

    // Container block (SVG)
    var container = d3.select("body") // Select the <body> element
        .append("svg")                // Append <svg>
        .attr("width", w)            // Set width
        .attr("height", h)           // Set height
        .attr("class", "container")  // Assign class name for styling
        .style("background-color", "rgba(0,0,0,0.2)"); // Light gray background

    // Inner rectangle block
    var innerRect = container.append("rect") // Append rectangle inside <svg>
        .datum(400)                          // Bind a datum (400)
        .attr("width", function(d) {
            return d * 2;                    // Width = 800
        })
        .attr("height", function(d) {
            return d;                        // Height = 400
        })
        .attr("class", "innerRect")          // Assign class for styling (optional)
        .attr("x", 50)                       // Offset from left
        .attr("y", 50)                       // Offset from top
        .style("fill", "#FFFFFF");           // Fill color: white
};
