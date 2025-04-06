// main.js
(function(){

    // Pseudo-global variables
    var attrArray = ["varA", "varB", "varC", "varD", "varE"];
    var expressed = attrArray[0];
    
    // Begin script when window loads
    window.onload = setMap;
    
    function setMap() {
        var width = 960,
            height = 460;
    
        var map = d3.select("body")
            .append("svg")
            .attr("class", "map")
            .attr("width", width)
            .attr("height", height);
    
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
    
            setGraticule(map, path);
    
            geojsonData = joinData(geojsonData, csvData);
    
            var colorScale = makeColorScale(csvData);
    
            setEnumerationUnits(geojsonData, map, path, colorScale);
        }
    }
    
    function setGraticule(map, path) {
        var graticule = d3.geoGraticule().step([5, 5]);
    
        var gratBackground = map.append("path")
            .datum(graticule.outline())
            .attr("class", "gratBackground")
            .attr("d", path);
    
        var gratLines = map.selectAll(".gratLines")
            .data(graticule.lines())
            .enter()
            .append("path")
            .attr("class", "gratLines")
            .attr("d", path);
    }
    
    function joinData(geojsonData, csvData){
        for (var i = 0; i < csvData.length; i++) {
            var csvRegion = csvData[i];
            var csvKey = csvRegion.id;
    
            for (var j = 0; j < geojsonData.length; j++) {
                var geojsonProps = geojsonData[j].properties;
                var geojsonKey = geojsonProps.Objectid;
    
                if (geojsonKey === csvKey) {
                    attrArray.forEach(function(attr) {
                        geojsonProps[attr] = parseFloat(csvRegion[attr]);
                    });
                }
            }
        }
        return geojsonData;
    }
    
    function makeColorScale(data){
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
    
    function setEnumerationUnits(geojsonData, map, path, colorScale){
        map.selectAll(".region")
            .data(geojsonData)
            .enter()
            .append("path")
            .attr("class", function(d) {
                return "region" + d.properties.Objectid;
            })
            .attr("d", path)
            .style("fill", function(d){
                var value = d.properties[expressed];
                if (value) {
                    return colorScale(value);
                } else {
                    return "#ccc";
                }
            });
    }
    
    })();