// global variable for location
var Location = {'latitude': 0.0, 'longitude': 0.0}

// get user location
function getLocation() {
    var x = document.getElementById("demo");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

// set location global variable, and put into body text
function setPosition(position) {
    Location.latitude = position.coords.latitude;
    Location.longitude = position.coords.longitude;
    var x = document.getElementById("demo");
    x.innerHTML = "Latitude: " + Location.latitude + "&#176; N" +
    "<br>Longitude: " + -Location.longitude + "&#176; W";

    var table =  document.getElementById("POITable");
    findNearby(Location.longitude, Location.latitude, 1);
    console.log(POIList);
    console.log(POIList.length);
    for (var i = 0; i < POIList.length; i++) {
        console.log(table[i]);
        var row = table.insertRow(i+1);
        var name_cell = row.insertCell(0);
        var dist_cell = row.insertCell(1);
        var address_cell = row.insertCell(2);
        var fax_cell = row.insertCell(3);
        name_cell.innerHTML = table[i].name;
        dist_cell.innerHTML = table[i].dist;
        address_cell.innerHTML = table[i].address;
        fax_cell.innerHTML = table[i].fax;
    }
}

$(document).ready(function() {
    getLocation()
});
