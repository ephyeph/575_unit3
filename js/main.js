// Wrap entire script in a self-executing function
(function(){

    // Pseudo-global variables
    var attrArray = ["varA", "varB", "varC", "varD", "varE"];
    var expressed = attrArray[0];
    
    window.onload = setMap;
    
    function setMap(){
        var width = window.innerWidth * 0.5,
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
    
        function callback(data){
            var csvData = data[0],
                germany = data[1];
    
            var geojsonData = topojson.feature(germany, germany.objects.de).features;
    
            var colorScale = makeColorScale(csvData);
    
            setGraticule(map, path);
    
            geojsonData = joinData(geojsonData, csvData);
    
            setEnumerationUnits(geojsonData, map, path, colorScale);
    
            setChart(csvData, colorScale);
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
            var csvRegion = csvData[i],
                csvKey = csvRegion.id;
    
            for (var j = 0; j < geojsonData.length; j++){
                var geojsonProps = geojsonData[j].properties,
                    geojsonKey = geojsonProps.id;
    
                if (geojsonKey === csvKey){
                    attrArray.forEach(function(attr){
                        var val = parseFloat(csvRegion[attr]);
                        geojsonProps[attr] = val;
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
        for (var i = 0; i < data.length; i++){
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
            .attr("class", function(d){ return "state " + d.properties.id; })
            .attr("d", path)
            .style("fill", function(d){
                var value = d.properties[expressed];
                return value ? colorScale(value) : "#ccc";
            });
    }
    
    function setChart(csvData, colorScale){
        var chartWidth = window.innerWidth * 0.425,
            chartHeight = 473,
            leftPadding = 25,
            rightPadding = 2,
            topBottomPadding = 5,
            chartInnerWidth = chartWidth - leftPadding - rightPadding,
            chartInnerHeight = chartHeight - topBottomPadding * 2,
            translate = "translate(" + leftPadding + "," + topBottomPadding + ")";
    
        var chart = d3.select("body")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("class", "chart");
    
        chart.append("rect")
            .attr("class", "chartBackground")
            .attr("width", chartInnerWidth)
            .attr("height", chartInnerHeight)
            .attr("transform", translate);
    
        var yScale = d3.scaleLinear()
            .range([chartInnerHeight, 0]) // Flip so bars grow up
            .domain([0, 100]);
    
        var bars = chart.selectAll(".bar")
            .data(csvData)
            .enter()
            .append("rect")
            .sort(function(a, b){ return b[expressed] - a[expressed]; })
            .attr("class", function(d){ return "bar " + d.id; })
            .attr("width", chartInnerWidth / csvData.length - 1)
            .attr("x", function(d, i){ return i * (chartInnerWidth / csvData.length) + leftPadding; })
            .attr("height", function(d){
                var val = parseFloat(d[expressed]);
                return chartInnerHeight - yScale(val);
            })
            .attr("y", function(d){
                var val = parseFloat(d[expressed]);
                return yScale(val) + topBottomPadding;
            })
            .style("fill", function(d){
                var val = parseFloat(d[expressed]);
                return isNaN(val) ? "#ccc" : colorScale(val);
            });
    
        chart.append("text")
            .attr("x", 40)
            .attr("y", 40)
            .attr("class", "chartTitle")
            .text("Number of " + expressed + " in each region");
    
        var yAxis = d3.axisLeft().scale(yScale);
    
        chart.append("g")
            .attr("class", "axis")
            .attr("transform", translate)
            .call(yAxis);
    
        chart.append("rect")
            .attr("class", "chartFrame")
            .attr("width", chartInnerWidth)
            .attr("height", chartInnerHeight)
            .attr("transform", translate);
    }
    
    
    })();
    