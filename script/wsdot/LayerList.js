/*global jQuery*/
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
			$("<a href='#' title='remove layer'>").text("X").appendTo($this.element).click(function () {
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
			// $.Widget.prototype.destroy.apply(this, arguments);
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
			map = $this.options.map;

			$this._list = $("<ul>");

			dojo.connect(map, "onLayerAdd", function (layer) {
				$("<li>").appendTo($this.element).layerListItem({ layer: layer, layerList: $this });
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
			this._list.remove();
			this._super();
			return this;
		}
	});
}(jQuery));