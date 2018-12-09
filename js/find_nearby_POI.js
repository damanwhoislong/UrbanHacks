
// find all nearby POI
function findNearby(coordLong, coordLat, r){
	var info = [];  // name, long, lat of POI
	var validLoc = [];  // all locations within radius

	// juicy stuff
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		// long and lat to km conversion
		var longCov = 80.00;
		var latCov = 111.045;

		if (this.readyState == 4 && this.status == 200) {
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
		}

	};
	xmlhttp.open("GET", "https://damanwhoislong.github.io/UrbanHacks/Data/Tourism_Points_of_Interest.json", true);
	xmlhttp.send();
	return validLoc;
}

console.log(findNearby(-79.8669586, 43.25888889, 1));
