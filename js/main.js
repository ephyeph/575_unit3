window.onload = setMap;

function setMap() {
    var width = 960,
        height = 460;

    // Create SVG container for the map
    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    // Create an Albers Equal-Area projection centered over Germany
    var projection = d3.geoAlbers()
        .center([10.5, 51]) // roughly center of Germany
        .rotate([-10.5, 0])
        .parallels([40, 60])
        .scale(3000)
        .translate([width / 2, height / 2]);

    // Create path generator
    var path = d3.geoPath()
        .projection(projection);

    // Load data
    var promises = [
        d3.csv("data/unitsData.csv"),
        d3.json("data/de.topojson")
    ];

    Promise.all(promises).then(callback);

    function callback(data) {
        var csvData = data[0],
            germany = data[1];

        // Convert TopoJSON to GeoJSON
        var geojsonData = topojson.feature(germany, germany.objects.de).features;

        // Draw German states
        map.selectAll(".state")
            .data(geojsonData)
            .enter()
            .append("path")
            .attr("class", function(d) {
                return "state " + d.properties.adm1_code;
            })
            .attr("d", path);
    }
}
