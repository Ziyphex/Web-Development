window.addEventListener("load", function() {
	loadFirstXML();
});

function loadXML() {
	let x = new XMLHttpRequest();
	let station = document.getElementById("station_dropdown").value;
	x.open("get", "http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByCodeXML_WithNumMins?StationCode="+station+"&NumMins=90", true);
	x.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			displayXML(x);
		}
	};
	x.send(null);
}

function loadFirstXML() {
	let x = new XMLHttpRequest();
	x.open("get", "http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByCodeXML_WithNumMins?StationCode=CNLLY&NumMins=90", true);
	x.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			displayXML(x);
		}
	};
	x.send(null);

	let y = new XMLHttpRequest();
	y.open("get", "http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML", true);
	y.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			displayAll(y);
		}
	};
	y.send(null);
}

function displayAll(xml){
	const doc = xml.responseXML;
	let dropdown_menu = "";
	var tag = doc.getElementsByTagName("StationDesc");
	for(var i = 0; i < tag.length; i++){
		stationName = doc.getElementsByTagName("StationDesc")[i].innerHTML;
		stationCode = doc.getElementsByTagName("StationCode")[i].innerHTML;
		dropdown_menu += "<option value='" + stationCode + "'>" + stationName + "</option>";
	}
	document.getElementById("station_dropdown").innerHTML = dropdown_menu;
	
}

function displayXML(xml) {
	const doc = xml.responseXML;
	console.log(doc);

	// Define the table headers
	let table = '<tr id="headers"><th>Due-In</th><th>Destination</th><th>Departure</th><th>Arrival At Destination</th><th>Origin</th></tr>'

	// Get info from the XML document
	let querytime = doc.getElementsByTagName("Querytime");
	let stationname = doc.getElementsByTagName("Stationfullname");
	let duein = doc.getElementsByTagName("Duein");
	let destination = doc.getElementsByTagName("Destination");
	let origintime = doc.getElementsByTagName("Origintime");
	let destinationtime = doc.getElementsByTagName("Destinationtime");
	let origin = doc.getElementsByTagName("Origin");
	
	// Add the query time to the table title
	if (querytime[0] !== undefined && stationname[0] !== undefined) {
		document.getElementById("table_title").innerHTML = stationname[0].innerHTML + " Station. Queried at " + querytime[0].innerHTML + ':';
	}

	// Add each station info
	for (let i = 0; i < duein.length; i++) {
		if (duein[i] !== undefined) {
			table += "<tr>";
			table += "<td>" + duein[i].innerHTML + " mins" + "</td>";
			table += "<td>" + destination[i].innerHTML + "</td>";
			table += "<td>" + origintime[i].innerHTML + "</td>";
			table += "<td>" + destinationtime[i].innerHTML + "</td>";
			table += "<td>" + origin[i].innerHTML + "</td>";
			table += "</tr>";
		}
	}

	if (duein.length !== 0){
		document.getElementById("xml_table").innerHTML = table;
		document.getElementById("err").innerHTML = '';
	} 
	else{
		// If the table is empty, display an error message
		document.getElementById("table_title").innerHTML = "No data available"
		document.getElementById("err").innerHTML = "No data available. Try again later!";
		document.getElementById("xml_table").innerHTML = '';
	}
}