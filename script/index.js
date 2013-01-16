/*global require, esri, jQuery*/
/*jslint browser:true*/
(function ($) {
	"use strict";
	/// <reference path="jsapi_vsdoc12_v33.js" />
	require(["dojo/on", "dojo/dom", "dojo/query", "wsdot/LayerFactory", "esri/map", "dojo/domReady!"], function (on, dom, query, LayerFactory) {
		var map, agsServiceDialog, agsUrlInput, layerFactory, layerList;

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

		layerList = $("<div>").layerList({ map: map }).dialog({
			title: "Layers",
			autoOpen: false
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

		agsServiceDialog = $("#dialog").dialog({
			title: "Add a map service",
			autoOpen: false
		});

		agsUrlInput = dom.byId("agsUrlInput");

		// When the add data button on the map is clicked, the add data dialog will be shown.
		on(dom.byId("addDataButton"), "click", function () {
			agsServiceDialog.dialog("open");
		});

		// When the add button is clicked, the layer for the URL in the dialog will be added to the map (if the user provided a URL).
		on(dom.byId("addAgsLayerButton"), "click", function () {
			var url;
			url = agsUrlInput.value;
			if (url) {
				layerFactory.createLayer({
					url: url
				});
				agsServiceDialog.dialog("close");
			}
		});

		// When the predefined layer button is clicked, the layer selected in the list will be added to the map.
		$("#addPredefinedLayerButton").click(function () {
			layerFactory.createLayer({
				type: $("#predefinedLayerSelect :selected").val()
			});
			agsServiceDialog.dialog("close");
			
		});

		$("#layersButton").click(function () {
			layerList.dialog("open");
		});

	});
}(jQuery));