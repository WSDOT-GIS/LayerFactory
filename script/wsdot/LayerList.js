$.widget("ui.layerListItem", ui.Widget, {
	options: {
		layer: null
	},
	/** Mandatory method - automatically called by jQuery Mobile to initialise the widget. */
	_create: function () {
		var $this = this;
		
		$("<input type='checkbox'>").appendTo($this.element).click(function () {
			if (this.checked === true) {
				$this.options.layer.show();
			} else {
				$this.options.layer.hide();
			}
		});
		$("<label>").text($this.options.layer.id).appendTo($this.element);
		$("<a href='#' title='remove layer'>").text("X").appendTo($this.element).click(function () {
			// Remove the layer from the map.
			$this.options.map.removeLayer($this.options.layer);
			// Remove this control from its parent.

			return false;
		});;
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

$.widget("ui.layerList", ui.Widget, {
	options: {
		map: null
	},
	_list: null,
	/** Mandatory method - automatically called by jQuery Mobile to initialise the widget. */
	_create: function () {
		var $this = this, map;

		if (!$this.options.map) {
			throw new Error("Map option not specified.");
		}
		map = $this.options.map;

		$this._list = $("<ul>");

		dojo.connect(map, "onLayerAdd", function (layer) {
			$("<li>").appendTo($this.element).layerListItem({layer: layer});
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
		$this._list.remove();
		this._super();
		return this;
	}
});