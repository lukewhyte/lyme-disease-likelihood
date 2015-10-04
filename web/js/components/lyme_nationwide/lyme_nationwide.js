// utils
import can from 'can';
import $ from 'jquery';
import 'can/map/define/define';
import d3 from 'd3';

// views
import template from './lyme_nationwide.stache!';

// components
import '../lyme_area_chart/lyme_area_chart';
import './lyme_radial_chart';

export default can.Component.extend({
	tag: 'lyme-nationwide',
	template: template,
	viewModel: {
		define: {
			vizLoaded: { type: 'boolean', value: false },
			areaChartLabel: {
				type: 'string',
				value: '# of reported Lyme Disease cases nationwide'
			},
			areaChartHeight: {
				type: 'number',
				value: 0,
				set: function (val) {
					return val * 0.6;
				}
			},
			height: {
				value: 0,
				type: 'number',
				set: function (val) {
					if (val) {
						this.attr('areaChartHeight', val);
					}
					return val;
				}
			},
			nationwide: {
				value: null,
				set: function (counties) {
					if (counties) {
						var result = this.getNationwideTemplate();
						_.forEach(counties.attr(), (county, ctyId) => {
							if (typeof county !== 'string') {
								_.forEach(result, function (val, key, col) {
									col[key] += county[key];
								});
							}
						});
						result['CTYNAME'] = 'Whole Country';
						result['STNAME'] = 'USA';
						return result;
					} else {
						return counties;
					}
				}
			},
			totalCases: {
				value: 0,
				get: function () {
					return this.attr('nationwide').Cases2014.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				}
			},
			topCounties: {
				value: null,
				set: function (allCounties) {
					if (allCounties) {
						var counties = allCounties.attr();
						delete counties._id;
						return _.sortBy(counties, (county, ctyId) => {
							county['id'] = ctyId; 
							return county.Cases2014;
						}).reverse().slice(1, 30);
					}
				}
			},
			counties: {
				value: null,
				set: function (newVal) {
					if (newVal) {
						this.attr('topCounties', newVal);
						this.attr('nationwide', newVal);
					}
					return newVal;
				}
			},
			currCounty: { 
				Value: can.Map,
				value: null
			},
			currCountyId: { 
				value: 0,
				type: 'number',
				set: function (val) {
					if (val) {
						var counties = this.attr('counties');
						this.attr('currCounty', counties[val]);
					}
					return val;
				}
			}
		},
		getNationwideTemplate: function () {
			return {
				Cases2014: 0,
				Cases2013: 0,
				Cases2012: 0,
				Cases2011: 0,
				Cases2010: 0,
				Cases2009: 0,
				Cases2008: 0,
				Cases2007: 0,
				Cases2006: 0,
				Cases2005: 0,
				Cases2004: 0,
				Cases2003: 0,
				Cases2002: 0,
				Cases2001: 0,
				Cases2000: 0,
			}
		}
	},
	events: {
		'{viewModel} vizLoaded': function () {
			setTimeout(() => {
				var arrow = this.element.children('div.arrow-down');
				arrow.css('top', $(window).height() * 0.9);
				$(document).on('scroll', function () {
					arrow.hide();
					$(this).off('scroll');
				});
			}, 1);
		}
	}
});