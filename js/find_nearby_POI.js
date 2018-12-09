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
function findNearby(coordLat, coordLong){
    var info = [];  // name, long, lat of POI
	var r = 1;  // 1 km radius to search
    var squareRange = [];  // square r km away
    
	// juicy stuff
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var jsonData = JSON.parse(this.responseText);
            for (i = 0; i < jsonData.length; i++) {
                // append long and lat to coord
				info.push({
					'name': jsonData.features[i].TITLE
                    'long': jsonData.features[i].LONGITUDE,
                    'lat': jsonData.features[i].LATITUDE
                });
            }

            // Initialize square range
            // Scan thru and save all  points within square range
            for (var i = 0; i < info.length; i++) {
                if (info[i].x < curLoc[0] + (r / longCov) &&
                    info[i].x > curLoc[0] - (r / longCov) &&
                    info[i].y < curLoc[1] + (r / latCov) &&
                    info[i].y > curLoc[1] - (r / latCov)) {
                    //converts the square into a circle :D
                    if (Math.pow(info[i].x - curLoc[0], 2) + Math.pow(info[i].y - curLoc[1], 2) <= Math.pow(r, 2)) {
                        squareRange.push([info[i].x, info[i].y]);
                    }
                }
            }
            console.log("num crimes: " + squareRange);
            document.getElementById("crimeCount").innerHTML = squareRange.length;

            //square root value
            var countSquareRange = Math.floor(Math.sqrt(squareRange.length) * 10) / 10;

            if (Math.floor(Math.sqrt(squareRange.length) * 10) / 10 > 10) {
                countSquareRange = 10;

            }
            // output to webpage
            document.getElementById("crimeRatingText").innerHTML = countSquareRange + "/10";

            document.getElementById("scale").style.width = countSquareRange * 10 + "%";
        }

        findDirection(squareRange, curLoc, latCov, longCov, r);

    };
	xmlhttp.open("GET", "https://burntpotatoes.github.io/safety-way/Crime%20Data/CrimeData.json", true);
    xmlhttp.send();
	
}

findNearby(1,1)

