// begin script when window loads
window.onload = setMap();

// set up choropleth map
function setMap() {
    // use Promise.all to parallelize asynchronous data loading
    var promises = [
        d3.csv("data/unitsData.csv"),
        d3.json("data/de.topojson")
    ];
    Promise.all(promises).then(callback);

    function callback(data) {
        var csvData = data[0],
            germany = data[1];

        console.log("CSV Data:", csvData);
        console.log("TopoJSON:", germany);

        // convert TopoJSON to GeoJSON
        var geojsonData = topojson.feature(germany, germany.objects.YOUR_OBJECT_NAME);
        console.log("Converted GeoJSON:", geojsonData);
    }
}
