var validLoc = []; // all locations within radius
// find all nearby POI
var Location = {'latitude': 0.0, 'longitude': 0.0};
var R;

// get user location
function getLocation() {
	var x = document.getElementById("demo");
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(setPosition);
	} else {
		x.innerHTML = "Geolocation is not supported by this browser.";
	}
}

function setPosition(position) {
	Location.latitude = position.coords.latitude;
	Location.longitude = position.coords.longitude;
	var x = document.getElementById("demo");
	x.innerHTML = "Latitude: " + Math.round(Location.latitude*1000)/1000.0 + "&#176; N" +
	"<br/><br/><br/><br/>Longitude: " + Math.round(-Location.longitude*1000)/1000 + "&#176; W";
	findNearby(Location.longitude, Location.latitude, R);
}

function findNearby(coordLong, coordLat, r){
	var info = [];  // name, long, lat of POI

	// juicy stuff
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		// long and lat to km conversion
		var longCov = 80.00;
		var latCov = 111.045;

		if (this.readyState == 4 && this.status == 200) {
			validLoc = [];
			var jsonData = JSON.parse(this.responseText);
			for (i = 0; i < jsonData.length; i++) {
				// append long and lat to coord
				info.push({
					'name': jsonData[i].TITLE,
					'x': jsonData[i].LONGITUDE,
					'y': jsonData[i].LATITUDE,
					'address': jsonData[i].ADDRESS,
					'fax': jsonData[i].DESCRIPTION
				});
			}

			// Initialize square range
			// Scan thru and save all  points within square range
			for (var i = 0; i < info.length; i++) {
				if (info[i].x < coordLong + (r / longCov) &&
				info[i].x > coordLong - (r / longCov) &&
				info[i].y < coordLat + (r / latCov) &&
				info[i].y > coordLat - (r / latCov)) {
					// check if its within the circle
					var dist = Math.sqrt(Math.pow((info[i].x - coordLong) * longCov, 2) + Math.pow((info[i].y - coordLat) * latCov, 2))
					if (dist < r) {
						validLoc.push({'name': info[i].name, 'dist': dist, 'address': info[i].address, 'fax': info[i].fax});
					}
				}
			}
			validLoc.sort((a, b) => (a.dist > b.dist) ? 1 : ((b.dist > a.dist) ? -1 : 0)); // sort by distance
			// validLoc.sort(function(a, b) {
			// 	if (a.dist > b.dist) return 1;
			// 	else if (a.dist > b.dist) return -1;
			// 	else return 0;
			// });
			console.log(validLoc);

			var table =  document.getElementById("POITable");
			// nuke old entries
			for (var i = table.rows.length; i > 1; i--) {
				table.deleteRow(1);
			}
			// make new entres
			POIList = validLoc;
			for (var i = 0; i < POIList.length; i++) {
				var row = table.insertRow(i+1);
				var name_cell = row.insertCell(0);
				var dist_cell = row.insertCell(1);
				var address_cell = row.insertCell(2);
				var fax_cell = row.insertCell(3);
				name_cell.innerHTML = POIList[i].name;
				if (POIList[i].dist >= 1.0) {
					dist_cell.innerHTML = Math.round(POIList[i].dist * 10)/10.0 + " km";
				} else if (POIList[i].dist >= 0.1){
					dist_cell.innerHTML = Math.round(POIList[i].dist * 10)*100 + " m";
				} else {
					dist_cell.innerHTML = Math.round(POIList[i].dist * 100)*10 + " m";
				}

				address_cell.innerHTML = POIList[i].address;
				fax_cell.innerHTML = POIList[i].fax;
			}
		}
	};
	xmlhttp.open("GET", "https://damanwhoislong.github.io/UrbanHacks/Data/Tourism_Points_of_Interest.json", true);
	xmlhttp.send();
}

$(document).ready(function() {
	//get radius
	var slider = document.getElementById("myRange");
	R = Math.pow(slider.value, 2) / 200;
	var output = document.getElementById("radius");
	output.innerHTML = Math.round(R*100)/100 + "km";

	slider.oninput = function() {
		R = Math.pow(slider.value, 2) / 200;
		output.innerHTML = Math.round(R*100)/100.0 + " km";
		getLocation();
	}
	getLocation();
});
// console.log(findNearby(-79.8669586, 43.25888889, 1));
