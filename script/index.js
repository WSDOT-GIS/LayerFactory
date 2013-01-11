/*global require, esri*/
/*jslint browser:true*/

/// <reference path="jsapi_vsdoc12_v33.js" />
require(["dojo/on", "dojo/dom", "dijit/Dialog", "wsdot/LayerFactory", "esri/map", "esri/layers/osm", "dojo/domReady!"], function (on, dom, Dialog, LayerFactory) {
	"use strict";
	var map, agsServiceDialog, agsUrlInput, layerFactory;

	layerFactory = new LayerFactory();
	on(layerFactory, "layerCreate", function (options) {
		var layer = options.layer;
		if (layer) {
			map.addLayer(layer);
		}
	});

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
			if (console) {
				if (console.error) {
					console.error(error);
				}
			}
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
		var url;
		url = agsUrlInput.value;
		layerFactory.createLayer({
			url: url
		});
		agsServiceDialog.hide();
	});
});