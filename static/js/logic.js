// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
var earthquakefeatures = [];
var place_time = [];
var mag = [];
var depth = [];
// A function to determine the marker size based on the population
function markerSize(x) {
  let myCalc = Number(x)+100;
  return myCalc;
};
function markerOpacity(x) {
  let myCalc = Number(x)/215;
  return myCalc;
};

d3.json(queryUrl).then(function (data) {
  var features = data.features;
  //earthquakefeatures.push(features);
  console.log(earthquakefeatures);

  createFeatures(data.features);



 


  //for (var i = 0; i < features.length; i++) {
  // Setting the marker radius for the state by passing population into the markerSize function
  //earthquakeMarkers.push(
  //  L.circleMarker(data.features[i].geometry.coordinates, {
  //    stroke: false,
  //    fillOpacity: 0.75,
  //    color: "white",
  //    fillColor: "white",
  //    radius: 500//markerSize(locations[i].state.population)
  //  })

  //  earthquakelatlng.push(features[i].geometry.coordinates);
  //  place_time.push([features[i].properties.place , features[i].properties.time]);
  //  mag.push(features[i].properties.mag);
  //  depth.push(features[i].geometry.coordinates[2]);
  //  };

//console.log(earthquakelatlng);
//console.log(place_time);
//console.log(mag);
//console.log(depth);
//console.log(markerSize(mag[0]));

});

function createFeatures(eqdata) {
 // Once we get a response, send the data.features object to the createFeatures function.
  
  function onEachFeature(feature, layer) {
    var features = feature;
    var layer = layer.bindPopup(`<h3>${features.properties.place}</h3><hr><p>${new Date(features.properties.time)}
    </br>${features.properties.mag} <hr>${features.geometry.coordinates[2]}</p>`)
    ;
    return layer;
  };

  function pointToLayer(feature, latlng) {
    //console.log(feature.properties.mag);
    return L.circleMarker(latlng, {
      
      radius: markerSize(feature.properties.mag),
      fillOpacity: markerOpacity(feature.geometry.coordinates[2]),
      color: "red",
      fillColor: "red"
      }
    
    );

  };
  var earthquakes = new L.geoJson(eqdata, {
    pointToLayer: pointToLayer,
    onEachFeature: onEachFeature
  });
  createMap(earthquakes);
  //console.log(feature.properties.mag)
};

function createMap(earthquakes) {

  
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });


// Create two separate layer groups: one for the city markers and another for the state markers.
//var earth = L.layerGroup(earthquakeMarkers._latlng);

// Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };
  console.log(earthquakes);
// Define a map object.
  var myMap = L.map("map", {
   center: [37.09, -95.71],
   zoom: 5,
   layers: [street, earthquakes]
  });

// Pass our map layers to our layer control.
// Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
  // Create a legend to display information about our map.
  var info = L.control({
    position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend".
  info.onAdd = function(myMap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
  };
  info.update = function (props) {
    this._div.innerHTML = '<h4>USGS Significant Earthquakes in Past 30 days</h4><br>Opacity: Depth <br>Circle Size: mag';
  };
  // Add the info legend to the map.
  info.addTo(myMap);
  
};

