(function(){

    // Pseudo-global variables
    var attrArray = ["varA", "varB", "varC", "varD", "varE"];
    var expressed = attrArray[0];
    
    // Start the script
    window.onload = setMap;
    
    function setMap(){
        var width = 960,
            height = 500;
    
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
    
        function callback(data){
            var csvData = data[0], topoData = data[1];
    
            // Graticule
            setGraticule(map, path);
    
            // Convert to GeoJSON
            var germanyRegions = topojson.feature(topoData, topoData.objects.de).features;
    
            // Join data
            germanyRegions = joinData(germanyRegions, csvData);
    
            // Create color scale
            var colorScale = makeColorScale(csvData);
    
            // Draw regions
            setEnumerationUnits(germanyRegions, map, path, colorScale);
        }
    }
    
    function setGraticule(map, path){
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
    
    function joinData(geojsonData, csvData){
        for (var i = 0; i < csvData.length; i++){
            var csvRegion = csvData[i];
            var csvKey = csvRegion.id;
    
            for (var a = 0; a < geojsonData.length; a++){
                var geoProps = geojsonData[a].properties;
                var geoKey = geoProps.id;
    
                if (geoKey === csvKey){
                    attrArray.forEach(function(attr){
                        var val = parseFloat(csvRegion[attr]);
                        geoProps[attr] = val;
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
        for (var i=0; i<data.length; i++){
            var val = parseFloat(data[i][expressed]);
            if (!isNaN(val)) domainArray.push(val);
        }
    
        colorScale.domain(domainArray);
        return colorScale;
    }
    
    function setEnumerationUnits(geojsonData, map, path, colorScale){
        map.selectAll(".state")
            .data(geojsonData)
            .enter()
            .append("path")
            .attr("class", function(d){
                return "state " + d.properties.id;
            })
            .attr("d", path)
            .style("fill", function(d){
                var value = d.properties[expressed];
                return value ? colorScale(value) : "#ccc";
            });
    }
    
    })();
    