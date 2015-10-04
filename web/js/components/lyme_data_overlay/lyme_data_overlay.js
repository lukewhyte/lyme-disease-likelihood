// utils
import can from 'can';
import $ from 'jquery';
import 'can/map/define/define';
import d3 from 'd3';
import lodash from 'lodash';
import '../../../bower_components/qtip2/jquery.qtip.min';

export default can.Component.extend({
    tag: "lyme-data-overlay",
    viewModel: {
    	define: {
    		counties: {
    			value: null,
    			set: function (data, setVal) {
    				setVal(data);
    				if (data && this.attr('map')) {
    					this.addDataToMap(data);
    				}
    			}
    		},
    		dateRange: { type: 'string', value: 'Cases2014' },
    		map: { 
    			type: '*', 
    			value: null,
    			set: function (map, setVal) {
    				setVal(map);
    				if (map && this.attr('counties')) {
    					this.addDataToMap(this.attr('counties'));
    				}
    			} 
    		},
    		cornerNE: { type: '*', value: [77.542, 3.295] },
    		cornerSW: { type: '*', value: [-18.312, -236.799] },
    		isMapView: { type: 'boolean', value: true },
    		currCounty: { Value: can.Map },
    		currCountyId: { type: 'number' },
    		isLoading: { type: 'boolean', value: true }
    	},

    	getDateRange: can.compute(function () {
    		return this.attr('dateRange');
    	}),

    	mapColor: d3.rgb('#741111'),

    	getCasesDomain: function () {
    		return _.uniq(_.pluck(_.sortBy(this.attr('counties'), this.getDateRange()), this.getDateRange()), true);
    	},

    	buildOrdinalScale: function (domainArr, rangeArr) { // Currently using ordinal scale for county total wealth coloring
			return d3.scale.ordinal().domain(domainArr).rangePoints(rangeArr);
		},

		renderMapData: function (data) {
			var vm = this,
				currPopup = null;
			var countyStream = this.map.counties.attr({
				d: this.map.path,
				fill: (d) => {
					if (data[d.id]) {
						var numCases = data[d.id][this.getDateRange()],
							rawResult = this.map.setCountyColor(numCases);
						return this.attr('mapColor').brighter(Math.round(rawResult * 10) / 10);
					} else {
						return 0;
					}
				},
				'fill-opacity': (d) => {
					if (data[d.id]) {
						var numCases = data[d.id][this.getDateRange()],
							rawResult = numCases !== 0 ? this.map.setCountyFillOpacity(numCases) : 0;
						return Math.round(rawResult * 10) / 10;
					} else {
						return 0;
					}
				}
			})
			.on('click', (d) => {
				this.attr('currCounty', this.attr('counties')[d.id]);
				this.attr('currCountyId', d.id);
			});

			this.buildTooltips();
			this.attr('isLoading', false);
		},

		buildTooltips: function () {
			var vm = this;
			$('#map svg g').on('click', 'path.counties', function (event) { // qtip2 handles event delegation... fuck yeah
				$(this).qtip({
					overwrite: false,
					show: {
						event: event.type,
						ready: true
					},
					hide: {
				        delay: 200,
				        fixed: true,
				        effect: function() { $(this).fadeOut(250); }
				    },
					content: {
						text: '<p><a href="#!county/' + vm.attr('currCountyId') + '">' +
							  'Click to see lyme statistics for <br><span>' +
							  vm.attr('currCounty').CTYNAME + ', ' +
							  vm.attr('currCounty').STNAME + '</span></a></p>'
					},
					style: { 
						classes: 'qtip-youtube',
						width: '200px',
						height: '50px'
					},
					position: {
						my: 'top right',
						at: 'bottom center'
					}
				}, event);
			});
		},

    	addDataToMap: function (data) {
    		this.map.svg.selectAll('g').remove(); // make sure svg is empty

    		var mapColor = this.attr('mapColor');
    		var casesDomain = this.getCasesDomain();

    		this.map.setCountyFillOpacity = this.buildOrdinalScale(casesDomain, [0.1,1]);
    		this.map.setCountyColor = this.buildOrdinalScale(casesDomain, [0.8, 0]);

    		this.map.addUSLeafletOverlay({
				county: 'path', // strings refer to type of svg element to be adde
				onReady: () => { this.map.reset(_.bind(this.renderMapData, this, data)); } // callback for onReady
			});

			this.map.view.setMaxBounds([this.attr('cornerNE'), this.attr('cornerSW')]);

			this.map.view.on('viewreset', () => {
				this.map.reset(_.bind(this.renderMapData, this, data));
			});
    	}
    },

    events: {
    	removed: function () {
    		$('#map svg g').off('click');
    	}
    }
});