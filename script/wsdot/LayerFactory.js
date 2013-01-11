/*global define, esri*/
/*jslint nomen:true*/
define(["require", "dojo/_base/declare", "dojo/Evented"], function (require, declare, Evented) {
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
		createLayer: function (options) {
			var self = this, mapServerRe, featureLayerRe, url;

			if (options.url) {
				url = options.url;

				mapServerRe = /MapServer\/?$/i;
				featureLayerRe = /MapServer\/\d+\/?$/i;


				if (mapServerRe.test(url)) {
					if (options.tiled) {
						require(["esri/layers/agstiled"], function () {
							var layer;
							layer = new esri.layers.ArcGISTiledMapServiceLayer(url);
							self._triggerLayerCreate(layer);
						});
					} else {
						require(["esri/layers/agsdynamic"], function () {
							var layer;
							layer = new esri.layers.ArcGISDynamicMapServiceLayer(url);
							self._triggerLayerCreate(layer);
						});
					}
				} else if (featureLayerRe.test(url)) {
					require(["esri/layers/FeatureLayer"], function () {
						var layer;
						layer = new esri.layers.FeatureLayer(url);
						self._triggerLayerCreate(layer);
					});
				}
			}
		}
	});

	return layerFactory;
});