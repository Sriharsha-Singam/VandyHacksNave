var currentStateVal = 0;
var dateVal = 0;
var apiString = 0;
var month = 0;
var day = 0;
var statesInUS = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"] //ALL STATES IN USA
var jsonStoreLocations;
var statesLat = [41, 39 , 42 , 39, 47, 43, 40, 41, 42, 45];
var statesLong = [-73, -104, -71, -76, -95, -71, -74, -77, -71, -73];
var statesList = [6, 7, 18, 19, 21, 28, 29, 37, 38, 44];
var states = [];
var map;
var jsonVal = null;
$( document ).ready(function() {
    $('.calendar').datepicker();
    $('button').click(function(event) {
        dateVal = $('#calendar').val(); 
        month = dateVal.slice(0,2);
   	    day = dateVal.slice(3,5);
        apiString = "s=" + statesInUS[currentStateVal] + "&m=" + month + "&d=" + day;
        if(dateVal != 0 && currentStateVal != 0){
			var url = "http://localhost:5000/predict?" + apiString;
			var jsonVal = JSON.parse(gettingHttp(url));
			console.log(jsonVal)
			outputChart(jsonVal)
			console.log("Chart updated.");
        }
    })
    $('.dropdown-menu a').on('click', function(){  
        currentStateVal = $(this).data("value");
        $('.dropdown-toggle').html($(this).html());
        var index = getAllIndexes(statesList, currentStateVal);
        map.setCenter(new google.maps.LatLng(parseFloat(statesLat[index[0]]),parseFloat(statesLong[index[0]])) );
        map.setZoom(7);
    })
    $.getJSON("StoreLocator.json", function(json) {
        jsonStoreLocations = json;
        addMarkers();
    });
});

function outputChart(jsonVal){
	var chart = new CanvasJS.Chart("chartContainer", {
		animationEnabled: true,
		theme: "dark1", // "light1", "light2", "dark1", "dark2"
		title:{
			text: "Predicted Relative Frequency of Purchase"
		},
		axisY: {
			title: "Probability of Purchase (%)"
		},
		data: [{        
			type: "column",  
			dataPoints: [      
				{ y: 100 * jsonVal.probs[0], label: jsonVal.topbuys[0] },
				{ y: 100 * jsonVal.probs[1],  label: jsonVal.topbuys[1] },
				{ y: 100 * jsonVal.probs[2],  label: jsonVal.topbuys[2] },
				{ y: 100 * jsonVal.probs[3],  label: jsonVal.topbuys[3] },
				{ y: 100 * jsonVal.probs[4],  label: jsonVal.topbuys[4] },
			]
		}]
	});
	chart.render(); 
}

function addMarkers(){
    for(var i = 0; i < jsonStoreLocations.length; i++){
        var index = getAllIndexes(statesInUS, jsonStoreLocations[i].state);
        states.push(index[0]);
    }
    for(var j = 0; j < statesInUS.length; j++){
            var indices = getAllIndexes(states, j);
            var places = [];
            var names = [];
            for(var y = 0; y < indices.length; y++){
                places.push({lat: jsonStoreLocations[indices[y]].latitude, lng: jsonStoreLocations[indices[y]].longitude});
                names.push(jsonStoreLocations[y].nickname);
            }
            var markers = places.map(function(location, i) {
              return new google.maps.Marker({
                position: location,
                label: names[i]
              });
            });
            var markerCluster = new MarkerClusterer(map, markers,{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    }    
}

function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}

function gettingHttp(url) {
  var xml = new XMLHttpRequest();
  xml.open( "GET", url, false );
  xml.send(null);
  return xml.responseText;
}