/*global require, jQuery*/
/*jslint nomen:true, plusplus:true */

/// <reference path="jsapi_vsdoc12_v33.js" />

(function ($) {
	"use strict";

	require(["dojo/on", "esri/arcgis/Portal", "esri/IdentityManager"], function (on, agol) {

		$.widget("ui.agolItem", {
			options: {
				// Put options here
				/** esri.arcgis.PortalItem */ portalItem: null
			},
			/** Mandatory method - automatically called by jQuery Mobile to initialise the widget. */
			_create: function () {
				var $this = this, details, portalItem;

				$this.element.addClass("agol-item");

				portalItem = $this.options.portalItem;

				$("<img>").attr({
					src: portalItem.thumbnailUrl,
					alt: "Thumbnail: " + portalItem.snippet
				}).appendTo($this.element);

				$("<p>").appendTo($this.element).text(portalItem.snippet);

				if (portalItem.details && portalItem.details.length) {


					details = $("<details>").appendTo($this.element);
					$("<summary>").text("details").appendTo(details);
					$("<div>").text(portalItem.details).appendTo(details);
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
				this.element.removeClass("agol-item");
				this._super();
				return this;
			}
		});

		$.widget("ui.agolResults", {
			options: {
				/** esri.arcgis.PortalQueryResult */ portalQueryResult: null
			},
			/** Mandatory method - automatically called by jQuery Mobile to initialise the widget. */
			_create: function () {
				var $this = this, result, i, l, item;

				$this.element.addClass("agol-results");

				result = $this.options.portalQueryResult;
				// Add the results to the displayed list.
				for (i = 0, l = result.results.length; i < l; i++) {
					item = result.results[i];
					$("<div>").appendTo($this.element).agolItem({
						portalItem: item
					});
				}

				// TODO: Handle additional pages of results.


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
				this.element.removeClass("agol-results");
				this._super();
				return this;
			}
		});

		$.widget("ui.agolBrowser", {
			options: {
				// Put options here
				portalUrl: null,
				num: 10,
				sortField: null
			},
			/** Mandatory method - automatically called by jQuery Mobile to initialise the widget. */
			_create: function () {
				var $this = this, form, portal, resultsPane, details, qBox;

				$this.element.addClass("agol-browser ui-widget");

				form = $("<form>").appendTo($this.element);

				// Add the search box.
				qBox = $("<input>").attr({
					placeholder: "Enter search terms here",
					type: "search"
				}).appendTo(form);

				// Add search options...
				details = $("<details>").appendTo($this.element);
				$("<summary>").text("Options").appendTo(details);
				$("<p>").text("Coming soon: options!").appendTo(details);

				resultsPane = $("<div>").addClass("agol-results").hide().appendTo($this.element);

				portal = new agol.Portal($this.options.portalUrl);

				on(portal, "ready", function (/*p*/) {
					form.submit(function() {
						var user;

						function beginQuery() {
							portal.queryItems({
								q: qBox.val()
							}).then(function (result) {
								$("<div>").appendTo($this.element).agolResults({
									portalQueryResult: result
								});
							});
						}

						user = portal.getPortalUser();
						if (!user.credential && portal.access === "private") {
							portal.signIn().then(function (loggedInUser) {
								user = loggedInUser;
								beginQuery();
							});
						} else {
							beginQuery();
						}

						return false;
					});
				});

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
				// $.Widget.prototype.destroy.apply(this, arguments);
				this._super();
				return this;
			}
		});
	});
}(jQuery));