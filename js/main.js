// Wrap everything in an IIFE
(function(){

    // Pseudo-global variables
    var attrArray = ["varA", "varB", "varC", "varD", "varE"];
    var expressed = attrArray[0];
    
    // Start when window loads
    window.onload = setMap;
    
    function setMap() {
        var width = 960,
            height = 460;
    
        // Create SVG container
        var map = d3.select("body")
            .append("svg")
            .attr("class", "map")
            .attr("width", width)
            .attr("height", height);
    
        // Projection centered on Germany
        var projection = d3.geoAlbers()
            .center([10.5, 51])
            .rotate([-10.5, 0])
            .parallels([40, 60])
            .scale(3000)
            .translate([width / 2 + 150, height / 2]);
    
        var path = d3.geoPath().projection(projection);
    
        // Load data
        var promises = [
            d3.csv("data/unitsData.csv"),
            d3.json("data/de.topojson")
        ];
        Promise.all(promises).then(callback);
    
        function callback(data) {
            var csvData = data[0],
                germany = data[1];
    
            var geojsonData = topojson.feature(germany, germany.objects.de).features;
    
            // Add graticule
            setGraticule(map, path);
    
            // Join CSV to GeoJSON
            geojsonData = joinData(geojsonData, csvData);
    
            // Create color scale
            var colorScale = makeColorScale(csvData);
    
            // Add states to map
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
    
            for (var j = 0; j < geojsonData.length; j++) {
                var geoProps = geojsonData[j].properties;
                var geoKey = geoProps.adm1_code;
    
                if (csvKey === geoKey) {
                    attrArray.forEach(function(attr) {
                        geoProps[attr] = parseFloat(csvRegion[attr]);
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
            domainArray.push(val);
        }
    
        colorScale.domain(domainArray);
        return colorScale;
    }
    
    function setEnumerationUnits(geojsonData, map, path, colorScale) {
        map.selectAll(".state")
            .data(geojsonData)
            .enter()
            .append("path")
            .attr("class", function(d) {
                return "state " + d.properties.adm1_code;
            })
            .attr("d", path)
            .style("fill", function(d) {
                var val = d.properties[expressed];
                if (val) {
                    return colorScale(val);
                } else {
                    return "#ccc";
                }
            });
    }
    
    })();
    