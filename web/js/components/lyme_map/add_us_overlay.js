import d3 from 'd3';
import L from '../../../node_modules/leaflet/dist/leaflet';
import topojson from '../../../node_modules/topojson/topojson.min';

export default function (map) {
	return function (options) { // these parameters represent the state & county SVG elements followed by onReady callback
		d3.json('/js/components/lyme_map/us.json', function (err, topology) {
			if (err) return console.error(err);
		
			var addFeatures = {
				addFeature: function (element, geoType) {
					return map.svg.append("g").attr("class", "leaflet-zoom-hide").selectAll(element)
								.data(topojson.feature(topology, topology.objects[geoType]).features)
                    			.enter()
                    			.append(element).attr('class', geoType);
				},

				addPath: function () {
					var projectPoint = function (x,y) { // Here we translate coordinates to map points and them stream them to d3 for projection as paths
				      var point = map.view.latLngToLayerPoint(new L.LatLng(y,x));
				      this.stream.point(point.x, point.y);
				    },

				    path = function () {
				    	var transform = d3.geo.transform({point: projectPoint});
				    	return d3.geo.path().projection(transform);
				    };

					return path();
				},

				reset: function (callback) {
					var bounds = map.path.bounds(topojson.feature(topology, topology.objects.counties)),
						topLeft = bounds[0],
          				bottomRight = bounds[1];

		          	var moveFeature = function (feat) {
		          		feat.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")"); // Move all the features (wrapped in 'g') as the map zooms
		          	};

		            map.svg.attr("width", bottomRight[0] - topLeft[0])
							.attr("height", bottomRight[1] - topLeft[1])
							.style("left", topLeft[0] + "px")
							.style("top", topLeft[1] + "px");

		      		$.each([map.counties, map.states], function (index, feat) {
		      			if (feat) moveFeature(feat);
		      		});

      				if (callback && typeof callback === 'function') callback();

      				return map;
				},

				setParams: function () {
					var defaults = {
						states: false,
						county: false,
						onReady: false
					};
					return $.extend({}, defaults, options);
				},

				init: function () {
					var params = this.setParams();
					map.counties = (params.county) ? this.addFeature(params.county, 'counties') : false;
					map.states = (params.states) ? this.addFeature(params.states, 'states') : false;
					map.path = this.addPath();
					map.reset = this.reset;
					map.initialize = this.reset;

					if (params.onReady && typeof params.onReady === 'function') return params.onReady();
				}
			};
			
			addFeatures.init();
		});
	};
};