require(["dojo/on", "dijit/Dialog", "esri/map", "esri/layers/osm", "dojo/domReady!"], function (on, Dialog) {
	var map, agsServiceDialog;


	map = new esri.Map("map", {
		basemap: "osm"
	});

	
	agsServiceDialog = new Dialog({
		title: "Title Goes Here",
		content: "Here's the content",
		style: "width: 300px"
	});

	on(dojo.byId("addDataButton"), "click", function () {
		agsServiceDialog.show();
	});
});