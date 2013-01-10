require(["dojo/on", "dojo/dom", "dijit/Dialog", "esri/map", "esri/layers/agsdynamic", "esri/layers/featureLayer", "esri/layers/osm", "dojo/domReady!"], function (on, dom, Dialog) {
	var map, agsServiceDialog, agsUrlInput;

	function addAgsLayer(url) {
		/// <summary>Adds an ArcGIS Service layer to a map.</summary>
		/// <param name="url" type="String">URL to a map service.</param>

		var mapServerRe, featureLayerRe, layer;
		mapServerRe = /MapServer\/?$/i;
		featureLayerRe = /MapServer\/\d+\/?$/i;

		if (mapServerRe.test(url)) {
			layer = new esri.layers.ArcGISDynamicMapServiceLayer(url);
		} else if (featureLayerRe.test(url)) {
			layer = new esri.layers.FeatureLayer(url);
		}
		if (layer) {
			map.addLayer(layer);
		}

		return layer;

	}

	map = new esri.Map("map", {
		basemap: "topo"
	});

	// If possible, get the client's current location and zoom the map.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var x, y;
			x = position.coords.longitude;
			y = position.coords.latitude;
			
			map.centerAndZoom(new esri.geometry.Point(x, y), 13);
		}, function (error) {
		});
	}

	
	agsServiceDialog = new Dialog({
		title: "Add a map service",
		content: dom.byId("dialog")
	});

	agsUrlInput = dom.byId("agsUrlInput");
	agsUrlInput.value = "http://faaservices-1551414968.us-east-1.elb.amazonaws.com/ArcGIS/rest/services/201101_AirportsGIS_BH/Obstacles/MapServer";

	on(dom.byId("addDataButton"), "click", function () {
		agsServiceDialog.show();
	});

	on(dom.byId("addAgsLayerButton"), "click", function () {
		addAgsLayer(agsUrlInput.value);
		agsServiceDialog.hide();
	});
});