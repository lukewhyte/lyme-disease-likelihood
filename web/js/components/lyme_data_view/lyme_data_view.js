// utils
import can from 'can';
import $ from 'jquery';
import 'can/map/define/define';
import d3 from 'd3';

// views
import template from './lyme_data_view.stache!';

// components
import '../lyme_area_chart/lyme_area_chart';

export default can.Component.extend({
	tag: 'lyme-data-view',
	template: template,
	viewModel: {
		define: {
			areaChartLabel: {
				type: 'string',
				value: ''
			},
			areaChartHeight: {
				type: 'number',
				value: 0
			},
			totalPop: {
				value: 0,
				get: function (val) {
					return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				}
			},
			cases: {
				value: 0,
				get: function (val) {
					return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				}
			},
			currCounty: { 
				Value: can.Map,
				value: null,
				set: function (newMap) {
					if (newMap) {
						this.attr('areaChartLabel',
							'# Of Reported Lyme Disease Cases In ' + newMap.attr('CTYNAME'));
						this.attr('cases', newMap.attr('Cases2014'));
						this.attr('totalPop', newMap.attr('totalPop'));
					}
					return newMap;
				} 
			},
			height: {
				type: 'number',
				value: 0,
				set: function (height) {
					this.attr('areaChartHeight', height * 0.6);
					return height;
				}
			}
		}
	},
	events: {
		inserted: function () {
			this.element.children('div.info').css('margin-top', this.viewModel.attr('height') * 0.1);
		}
	}
});