﻿/*global jQuery*/
/*jslint nomen:true*/
(function ($) {
	"use strict";

	$.widget("ui.layerListItem", {
		options: {
			layer: null,
			layerList: null
		},
		/** Mandatory method - automatically called by jQuery Mobile to initialise the widget. */
		_create: function () {
			var $this = this;

			$this.element.addClass("ui-layer-list-item");

			// Create a checkbox that will turn the layer on and off.
			$("<input type='checkbox'>").prop("checked", $this.options.layer.visible).appendTo($this.element).click(function () {
				if (this.checked === true) {
					$this.options.layer.show();
				} else {
					$this.options.layer.hide();
				}
			});
			// Label the checkbox with the ID of the layer.
			$("<label>").text($this.options.layer.id).appendTo($this.element);
			$("<a href='#' title='remove layer' class='ui-layer-list-item-remove-layer-link'>").text("×").appendTo($this.element).click(function () {
				// Remove the layer from the map.
				$this.options.layerList.options.map.removeLayer($this.options.layer);
				// Remove this control from its parent.
				$($this.element).remove();
				return false;
			});
			return this;
		},
		_setOption: function (key, value) {
			var $this = this;
			// Put custom code here
			$this._super();
			return this;
		},
		_destroy: function () {
			$this.element.removeClass("ui-layer-list-item");
			this._super();
			return this;
		}
	});

	$.widget("ui.layerList", {
		options: {
			map: null
		},
		_list: null,
		/** Creates the layer list widget.
		* @param {esri.Map} map
		* @returns {jQuery}
		*/
		_create: function () {
			var $this = this, map;

			if (!$this.options.map) {
				throw new Error("Map option not specified.");
			}

			$this.element.addClass("ui-layer-list");
			map = $this.options.map;

			// Create the list and make it sortable.
			// TODO: Layers should be listed in reverse order.  Layer at top of list should be the one on top of all layers in the map.
			$this._list = $("<ul>").appendTo($this.element).sortable({
				/**
				@param {Event} event
				@param {Object} ui
				@param {jQuery} helper
				@param {jQuery} item
				@param {Object} offset
				@param {Object} position
				@param {Object} originalPosition
				@param {jQuery} sender
				*/
				stop: function (event, ui) {
					var layer = ui.item.layerListItem("option", "layer"), newPosition = ui.item.prevAll().length;
					map.reorderLayer(layer, newPosition);
				}
			}).disableSelection();

			dojo.connect(map, "onLayerAdd", function (layer) {
				$("<li>").appendTo($this._list).layerListItem({ layer: layer, layerList: $this });
			});



			return this;
		},
		_setOption: function (key, value) {
			var $this = this;
			// Put custom code here
			$this.element.removeClass("ui-layer-list");

			$this._super();
			return this;
		},
		_destroy: function () {
			this._list.remove();
			this._super();
			return this;
		}
	});
}(jQuery));