import d3 from 'd3';
import L from '../../../node_modules/leaflet/dist/leaflet';

var defaults = {
	id: 'map',
	width: null,
	height: null,
	center: [37.545, -97.383],
	zoom: 4,
	minZoom: 0,
	maxZoom: 19,
	tile: 'http://{s}.tiles.mapbox.com/v4/lukewhyte.nf1363o3/{z}/{x}/{y}.png',
	accessToken: 'pk.eyJ1IjoibHVrZXdoeXRlIiwiYSI6IlZHaDVCQjQifQ.yUYnbLVrkSRq2Akdyirobg',
	g: true
};

var MapFactory = function MapFactory (options) {
	this.options = $.extend({}, defaults, options);
	this.canvas = d3.select('#' + this.options.id);
	return this.init();
};

MapFactory.prototype = {
	setDimensions: function (canvas) {
		var w = (!this.options.width) ? parseInt(this.canvas.style('width')) : this.options.width,
			h = (!this.options.height) ? w * 0.60 : this.options.height;
		return { w: w, h: h };
	},

	buildMap: function (dimensions) { // Build map using leaflet
  		this.canvas.style('height', dimensions.h+'px'); // Set the map height before instantiating it
  		return new L.Map(this.options.id, {
  			center: this.options.center, 
  			zoom: this.options.zoom, 
  			maxZoom: this.options.maxZoom,
  			minZoom: this.options.minZoom
  		}).addLayer(new L.TileLayer(this.options.tile + '?access_token=' + this.options.accessToken));
	},

	init: function () {
		var opts = this.options,
			dimensions = this.setDimensions(),
			map = this.buildMap(dimensions),
			svg = d3.select(map.getPanes().overlayPane).append("svg"),
			g = (opts.g) ? svg.append("g").attr("class", "leaflet-zoom-hide") : null;

		return {
			w: dimensions.w,
			h: dimensions.h,
			canvas: this.canvas,
			view: map,
			svg: svg,
			g: g
		};
	}
};

var mapAPI = function mapAPI (options) {
	return new MapFactory(options);
}

export default mapAPI;