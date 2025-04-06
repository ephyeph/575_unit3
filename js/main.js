(function() {

    // Pseudo-global variables
    var attrArray = ["varA", "varB", "varC", "varD", "varE"];
    var expressed = attrArray[0];

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

        // Albers projection centered over Germany
        var projection = d3.geoAlbers()
            .center([10.5, 51])
            .rotate([-10.5, 0])
            .parallels([40, 60])
            .scale(3000)
            .translate([width / 2 + 150, height / 2]);

        var path = d3.geoPath().projection(projection);

        var promises = [
            d3.csv("data/unitsData.csv"),
            d3.json("data/de.topojson")
        ];

        Promise.all(promises).then(callback);

        function callback(data) {
            var csvData = data[0],
                germany = data[1];

            var geojsonData = topojson.feature(germany, germany.objects.de).features;

            // Create graticule
            setGraticule(map, path);

            // Join CSV to GeoJSON
            geojsonData = joinData(geojsonData, csvData);

            // Create color scale
            var colorScale = makeColorScale(csvData);

            // Add enumeration units to map
            setEnumerationUnits(geojsonData, map, path, colorScale);
        }
    }

    function setGraticule(map, path) {
        var graticule = d3.geoGraticule().step([5, 5]);

        map.append("path")
            .datum(graticule.outline())
            .attr("class", "gratBackground")
            .attr("d", path);

        map.selectAll(".gratLines")
            .data(graticule.lines())
            .enter()
            .append("path")
            .attr("class", "gratLines")
            .attr("d", path);
    }

    function joinData(geojsonData, csvData) {
        for (var i = 0; i < csvData.length; i++) {
            var csvRegion = csvData[i];
            var csvKey = csvRegion.adm1_code;

            for (var a = 0; a < geojsonData.length; a++) {
                var geoProps = geojsonData[a].properties;
                var geoKey = geoProps.adm1_code;

                if (geoKey === csvKey) {
                    attrArray.forEach(function(attr) {
                        var val = parseFloat(csvRegion[attr]);
                        geoProps[attr] = val;
                    });
                }
            }
        }
        return geojsonData;
    }

    function makeColorScale(data) {
        var colorClasses = [
            "#D4B9DA",
            "#C994C7",
            "#DF65B0",
            "#DD1C77",
            "#980043"
        ];

        var colorScale = d3.scaleQuantile().range(colorClasses);

        var domainArray = [];
        for (var i = 0; i < data.length; i++) {
            var val = parseFloat(data[i][expressed]);
            if (!isNaN(val)) {
                domainArray.push(val);
            }
        }

        colorScale.domain(domainArray);
        return colorScale;
    }

    function setEnumerationUnits(geojsonData, map, path, colorScale) {
        map.selectAll(".regions")
            .data(geojsonData)
            .enter()
            .append("path")
            .attr("class", function(d) {
                return "regions " + d.properties.adm1_code;
            })
            .attr("d", path)
            .style("fill", function(d) {
                var value = d.properties[expressed];
                return value ? colorScale(value) : "#ccc";
            });
    }

})();
