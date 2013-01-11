/*global define, esri*/
/*jslint nomen:true*/
/// <reference path="../jsapi_vsdoc12_v33.js" />
define(["require", "dojo/_base/declare", "dojo/Evented", "dojo/io/script"], function (require, declare, Evented) {
	"use strict";
	var layerFactory;

	layerFactory = declare([Evented], {
		constructor: function (/*options*/) {
			// this.map = options.map || null;
		},
		_triggerLayerCreate: function(layer) {
			this.emit("layerCreate", {
				layer: layer
			});
		},
		_triggerError: function(error) {
			this.emit("layerCreate", {
				error: error
			});
		},
		
		/** 
		* @param {Object} options The options provided will vary depending on the type of layer to be created.
		* @param {String} [options.url] The URL used to define service types such as ArcGISTiledMapServiceLayer, ArcGISDynamicServiceLayer, and ArcGISImageServiceLayer.
		* @param {Object} [options.options] Layer constructors that take an options parameter can have those options provided via this property.
		* @param {String} [options.type] The name of the type, for situations where the type cannot be determined by a URL, or if a URL is not required (e.g., OpenStreetMapLayer.).
		*/
		createLayer: function (options) {
			var self = this, mapServerRe, featureLayerRe, imageServerRe, url;

			if (options.url) {
				url = options.url;

				mapServerRe = /MapServer\/?$/i;
				featureLayerRe = /((MapServer\/\d+)|(FeatureServer))\/?$/i;
				imageServerRe = /ImageServer\/?/i;


				// Create a different layer type based on the URL.
				if (mapServerRe.test(url)) {
					// Query the map service to see if it is a tiled map service. (We cannot determine this based on the URL alone.)
					esri.request({
						url: url,
						content: {
							f: "json"
						},
						callbackParamName: "callback",
						handleAs: "json"
					}).then(function (response) {
						if (response.singleFusedMapCache) {
							// Create a tile map service layer.
							require(["esri/layers/agstiled"], function () {
								var layer;
								layer = new esri.layers.ArcGISTiledMapServiceLayer(url);
								self._triggerLayerCreate(layer);
							});
						} else {
							// Create a dynamic map service layer.
							require(["esri/layers/agsdynamic"], function () {
								var layer;
								layer = new esri.layers.ArcGISDynamicMapServiceLayer(url);
								self._triggerLayerCreate(layer);
							});
						}
					}, function (error) {
						
					});
				} else if (featureLayerRe.test(url)) {
					require(["esri/layers/FeatureLayer"], function () {
						var layer;
						layer = new esri.layers.FeatureLayer(url);
						self._triggerLayerCreate(layer);
					});
				} else if (imageServerRe.test(url)) {
					require(["esri/layers/agsimageservice"], function () {
						var layer;
						layer = new esri.layers.ArcGISImageServiceLayer(url);
						self._triggerLayerCreate(layer);
					});
				}
			} else if (options.type) {
				if (/^OpenStreetMap$/i.test(options.type)) {
					require(["esri/layers/osm"], function () {
						var layer;
						layer = new esri.layers.OpenStreetMapLayer(options.options);
						self._triggerLayerCreate(layer);
					});
				}
				
			}
		}
	});

	return layerFactory;
});