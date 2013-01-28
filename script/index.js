/*global require, esri, jQuery*/
/*jslint browser:true*/
/*jshint dojo:true*/
/// <reference path="jsapi_vsdoc12_v33.js" />
(function ($) {
	"use strict";
	require(["dojo/on", "dojo/dom", "wsdot/LayerFactory", "esri/map"], function (on, dom, LayerFactory) {
		var map, agsServiceDialog, agsUrlInput, layerFactory, layerList;

		layerFactory = new LayerFactory();
		on(layerFactory, "layerCreate", function (options) {
			var layer = options.layer;
			if (layer) {
				map.addLayer(layer);
			}
		});

		////$("<div>").fullBrowserPanel();

		map = new esri.Map("map", {
			basemap: "topo",
			// LODs copied from http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer?f=pjson
			lods: [
				{ "level": 0, "resolution": 156543.033928, "scale": 591657527.591555 },
				{ "level": 1, "resolution": 78271.5169639999, "scale": 295828763.795777 },
				{ "level": 2, "resolution": 39135.7584820001, "scale": 147914381.897889 },
				{ "level": 3, "resolution": 19567.8792409999, "scale": 73957190.948944 },
				{ "level": 4, "resolution": 9783.93962049996, "scale": 36978595.474472 },
				{ "level": 5, "resolution": 4891.96981024998, "scale": 18489297.737236 },
				{ "level": 6, "resolution": 2445.98490512499, "scale": 9244648.868618 },
				{ "level": 7, "resolution": 1222.99245256249, "scale": 4622324.434309 },
				{ "level": 8, "resolution": 611.49622628138, "scale": 2311162.217155 },
				{ "level": 9, "resolution": 305.748113140558, "scale": 1155581.108577 },
				{ "level": 10, "resolution": 152.874056570411, "scale": 577790.554289 },
				{ "level": 11, "resolution": 76.4370282850732, "scale": 288895.277144 },
				{ "level": 12, "resolution": 38.2185141425366, "scale": 144447.638572 },
				{ "level": 13, "resolution": 19.1092570712683, "scale": 72223.819286 },
				{ "level": 14, "resolution": 9.55462853563415, "scale": 36111.909643 },
				{ "level": 15, "resolution": 4.77731426794937, "scale": 18055.954822 },
				{ "level": 16, "resolution": 2.38865713397468, "scale": 9027.977411 },
				{ "level": 17, "resolution": 1.19432856685505, "scale": 4513.988705 },
				{ "level": 18, "resolution": 0.597164283559817, "scale": 2256.994353 },
				{ "level": 19, "resolution": 0.298582141647617, "scale": 1128.497176 }
			]
		});

		// Show a progress meter when the map is loading data.
		dojo.connect(map, "onUpdateStart", function () {
			$("#mapProgress").show();
		});

		dojo.connect(map, "onUpdateEnd", function () {
			$("#mapProgress").hide();
		});

		layerList = $("<div>").layerList({ map: map }).dialog({
			title: "Layers",
			autoOpen: false
		});

		// If possible, get the client's current location and zoom the map.
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				// Zoom to the current position
				var x, y;
				x = position.coords.longitude;
				y = position.coords.latitude;

				map.centerAndZoom(new esri.geometry.Point(x, y), 13);
			}, function (error) {
				// Write an error to the error console if the current position could not be retrieved.
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

		$("#agolButton").click(function () {
			var agolBrowser;
			if (!agolBrowser) {
				// Create the AGOL Browser widget.
				$("<div>").agolBrowser({
					portalUrl: [location.protocol, "wsdot.maps.arcgis.com"].join("//")
				}).dialog({
					title: "ArcGIS Online"
				});
			} else {
				agolBrowser.dialog("open");
			}
		});


	});
}(jQuery));