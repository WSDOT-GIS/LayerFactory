/*global jQuery*/
/*jslint nomen:true, browser:true*/
(function ($) {
	"use strict";
	$.widget("ui.fullBrowserPanel", {
		options: {
		},
		_originalStyle: null,
		_originalClass: null,
		_handleResize: null,
		/** Mandatory method - automatically called by jQuery Mobile to initialise the widget. */
		_create: function () {
			var $this = this, el = this.element;


			// Store the original value of the style attribute of this element so it can be restored in the _destroy function.
			$this._originalStyle = el.attr("style");
			$this._originalClass = el.attr("class");

			// Set the width to 100%
			el.width("100%").height("100%").addClass("ui-widget ui-widget-content ui-corner-all").css({
				position: "absolute",
				left: 0,
				top: 0,
				"z-index": 50
			});

			// If this element has no parent, add it to the document body.
			if (!el.parent().length) {
				el.appendTo("body");
			}
			

			$this._super();
			return this;
		},
		_setOption: function (key, value) {
			var $this = this;
			// Put custom code here
			$this._super();
			return this;
		},
		_destroy: function () {
			// Reset the value of the style attribute.
			this.element.attr("style", this._originalStyle);

			this._super();
			return this;
		}
	});
}(jQuery));