require(["esri/map", "esri/layers/osm", "dojo/domReady!"], function () {
	var map;

	map = new esri.Map("map", {
		basemap: "osm"
	});
});