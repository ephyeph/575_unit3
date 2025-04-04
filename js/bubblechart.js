window.onload = function() {

    // Dimensions
    var w = 950, h = 500;

    // SVG container
    var container = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "container")
        .style("background-color", "rgba(0,0,0,0.2)");

    // White inner rect
    var innerRect = container.append("rect")
        .datum(435)
        .attr("width", function(d) { return d * 2; })
        .attr("height", function(d) { return d; })
        .attr("class", "innerRect")
        .attr("x", 50)
        .attr("y", 50)
        .style("fill", "#FFFFFF")
        .style("stroke", "none");

    // Data array
    var cityPop = [
        { city: 'Madison', population: 233209 },
        { city: 'Milwaukee', population: 594833 },
        { city: 'Green Bay', population: 104057 },
        { city: 'Superior', population: 27244 }
    ];

    // Min/max calculations
    var minPop = d3.min(cityPop, d => d.population);
    var maxPop = d3.max(cityPop, d => d.population);

    // Scales
    var x = d3.scaleLinear()
        .range([90, 870])  // Increased max to fit labels
        .domain([0, cityPop.length - 1]);

    var y = d3.scaleLinear()
        .range([450, 50])
        .domain([0, 700000]);

    var color = d3.scaleLinear()
        .range(["#FDBE85", "#D94701"])
        .domain([minPop, maxPop]);

    // Axis
    var yAxis = d3.axisLeft(y);

    var axis = container.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(50, 0)")
        .call(yAxis);

    // Title
    var title = container.append("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("x", 450)
        .attr("y", 30)
        .text("City Populations");

    // Circles
    var circles = container.selectAll(".circles")
        .data(cityPop)
        .enter()
        .append("circle")
        .attr("class", "circles")
        .attr("id", d => d.city)
        .attr("r", d => Math.sqrt((d.population * 0.01) / Math.PI))
        .attr("cx", (d, i) => x(i))
        .attr("cy", d => y(d.population))
        .style("fill", d => color(d.population))
        .style("stroke", "#000");

    // Labels (2-line with tspan)
    var format = d3.format(",");

    var labels = container.selectAll(".labels")
        .data(cityPop)
        .enter()
        .append("text")
        .attr("class", "labels")
        .attr("text-anchor", "left")
        .attr("y", d => y(d.population) - 5); // slightly above vertical center

    var nameLine = labels.append("tspan")
        .attr("class", "nameLine")
        .attr("x", (d, i) => x(i) + Math.sqrt((d.population * 0.01) / Math.PI) + 5)
        .text(d => d.city);

    var popLine = labels.append("tspan")
        .attr("class", "popLine")
        .attr("x", (d, i) => x(i) + Math.sqrt((d.population * 0.01) / Math.PI) + 5)
        .attr("dy", "15")
        .text(d => "Pop. " + format(d.population));
};
