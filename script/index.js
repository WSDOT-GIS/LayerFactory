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
		basemap: "osm"
	});

	
	agsServiceDialog = new Dialog({
		title: "Add a map service",
		content: "<label for='agsUrlInput'>ArcGIS Map Service URL</label><input id='agsUrlInput' type='url' /><button id='addAgsLayerButton'>Add</button>",
		resizable: true
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