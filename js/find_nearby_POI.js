var validLoc = []; // all locations within radius
// find all nearby POI
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

function setPosition(position) {
	Location.latitude = position.coords.latitude;
	Location.longitude = position.coords.longitude;
	var x = document.getElementById("demo");
	x.innerHTML = "Latitude: " + Location.latitude + "&#176; N" +
	"<br>Longitude: " + -Location.longitude + "&#176; W";
	findNearby(Location.longitude, Location.latitude, 1.0);
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
			console.log(validLoc);
			validLoc.sort((a, b) => (a.dist > b.dist) ? 1 : ((b.dist > a.dist) ? -1 : 0)); // sort by distance
			// validLoc.sort(function(a, b) {
			// 	if (a.dist > b.dist) return 1;
			// 	else if (a.dist > b.dist) return -1;
			// 	else return 0;
			// });
			console.log(validLoc);
			console.log(validLoc.length);

			var table =  document.getElementById("POITable");
			POIList = validLoc;
			for (var i = 0; i < POIList.length; i++) {
				console.log(table[i]);
				var row = table.insertRow(i+1);
				var name_cell = row.insertCell(0);
				var dist_cell = row.insertCell(1);
				var address_cell = row.insertCell(2);
				var fax_cell = row.insertCell(3);
				name_cell.innerHTML = POIList[i].name;
				if (POIList[i].dist >= 1.0) {
					dist_cell.innerHTML = Math.round(POIList[i].dist * 10)/10.0 + " km";
				} else {
					dist_cell.innerHTML = Math.round(POIList[i].dist * 10)*10 + " m";
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
	getLocation()
});
// console.log(findNearby(-79.8669586, 43.25888889, 1));
