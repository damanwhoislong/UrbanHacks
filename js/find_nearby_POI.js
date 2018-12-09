// 1. get location 
// 2. get coordinates of POI 
// 3. return all nearby POI -->

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		x.innerHTML = "Geolocation is not supported by this browser.";
	}
}

// find all nearby POI
function findNearby(coordLong, coordLat){
    var info = [];  // name, long, lat of POI
    var validLoc = [];  // all locations within radius
    
	// juicy stuff
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {

		var r = 1;  // 1 km radius to search
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
                    'y': jsonData[i].LATITUDE
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
                    if (Math.pow(info[i].x - coordLong, 2) + Math.pow(info[i].y - coordLat, 2) <= Math.pow(r, 2)) {
                        validLoc.push([info[i].name, info[i].x, info[i].y]);
                    }
                }
            }
            console.log("num crimes: " + validLoc);
            // document.getElementById("crimeCount").innerHTML = validLoc.length;

            //square root value
            var countvalidLoc = Math.floor(Math.sqrt(validLoc.length) * 10) / 10;

            if (Math.floor(Math.sqrt(validLoc.length) * 10) / 10 > 10) {
                countvalidLoc = 10;

            }
            // output to webpage
            // document.getElementById("crimeRatingText").innerHTML = countvalidLoc + "/10";
			// document.getElementById("scale").style.width = countvalidLoc * 10 + "%";
        
		}

    };
	xmlhttp.open("GET", "https://damanwhoislong.github.io/UrbanHacks/Data/Tourism_Points_of_Interest.json", true);
    xmlhttp.send();
	
}

findNearby(1,1)

