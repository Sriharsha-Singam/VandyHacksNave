//var map;
//function initMap() {
//    map = new google.maps.Map(document.getElementById('map'), {
//        center: {lat: 39.83333333, lng: -98.58333333},
//        zoom: 5
//    });
//    var place = {lat: 39.83333333, lng: -98.58333333};
//    var marker = new google.maps.Marker({position: place, map: map});
//}

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
//var marker = []
var states = [];
var map;
$( document ).ready(function() {
    console.log( "ready!" );
    $('.calendar').datepicker();
    $('button').click(function(event) {
        dateVal = $('#calendar').val(); 
        month = dateVal.slice(0,2);
   	    day = dateVal.slice(3,5);
        apiString = "s=" + currentStateVal + "&m=" + month + "&d=" + day;
        console.log(apiString);
    })
    $('.dropdown-menu a').on('click', function(){  
        currentStateVal = $(this).data("value");
        $('.dropdown-toggle').html($(this).html());
        var index = getAllIndexes(statesList, currentStateVal);
        map.setCenter(new google.maps.LatLng(parseFloat(statesLat[index[0]]),parseFloat(statesLong[index[0]])) );
        map.setZoom(7);
    })
    $.getJSON("StoreLocatore.json", function(json) {
            console.log(json.length);
            jsonStoreLocations = json;
            addMarkers();
    });
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        title:{
            text: "Most Likely Purchased Items"
        },
        axisY: {
            title: "% probability of Purchase"
        },
        data: [{        
            type: "column",  

            dataPoints: [      
                { y: 300878, label: "Venezuela" },
                { y: 266455,  label: "Saudi" },
                { y: 169709,  label: "Canada" },
                { y: 158400,  label: "Iran" },
                { y: 142503,  label: "Iraq" },
            ]
        }]
    });
    chart.render(); 
    
});

function addMarkers(){
    for(var i = 0; i < jsonStoreLocations.length; i++){
        var index = getAllIndexes(statesInUS, jsonStoreLocations[i].state);
        states.push(index[0]);
        if(i == 1)
            console.log(index[0]);
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
