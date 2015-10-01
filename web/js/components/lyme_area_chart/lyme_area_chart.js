// utils
import can from 'can';
import $ from 'jquery';
import _ from 'lodash';
import 'can/map/define/define';
import 'd3';
import c3 from 'c3';

import template from './lyme_area_chart.stache!';

export default can.Component.extend({
	tag: 'lyme-area-chart',
	template: template,
	viewModel: {
		define: {
			cases: {
				type: '*',
				value: null,
				set: function (currCounty) {
					if (currCounty) {
						var cases = [];
						for (var i = 0; i < 15; i++) {
							if (i < 10) {
								cases.push(currCounty['Cases200' + i]);
							} else {
								cases.push(currCounty['Cases20' + i]);
							}
						}
						return cases;
					} else {
						return null;
					}
				}
			},
			currCounty: { 
				Value: can.Map,
				set: function (newVal) {
					if (newVal) {
						this.attr('cases', newVal);
					}
					return newVal;
				}
			},
			height: {
				type: 'number',
				value: 0
			},
			label: {
				type: 'string',
				value: ''
			}
		}
	},
	events: {
		inserted: function () {
			this.buildChart();
		},

		buildChart: function () {
			if (this.viewModel.attr('cases')) {
				var label = this.viewModel.attr('label'),
					data = this.viewModel.attr('cases'),
					width = this.element.width(),
					height = this.viewModel.attr('height'),
					colors = {};

				data.unshift(label);
				colors[label] = '#741111';

				c3.generate({
					bindto: '.areaChart',
					size: {
						height: height,
						width: width
					},
					data: {
				        columns: [data],
				        type: 'area-spline',
				        colors: colors
				    },
				    axis: {
				    	x: {
				    		tick: {
				    			format: function (x) {
				    				return (x < 10) ? '200' + x : '20' + x;
				    			},
				    			rotate: 90,
				    			culling: false
				    		}
				    	}
				    }
				});
			}
		},

		'{viewModel} cases': 'buildChart'
	}
});