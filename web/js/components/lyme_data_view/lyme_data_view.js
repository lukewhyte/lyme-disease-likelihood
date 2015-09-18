// utils
import can from 'can';
import $ from 'jquery';
import 'can/map/define/define';
import d3 from 'd3';
import c3 from 'c3';

// views
import template from './lyme_data_view.stache!';

export default can.Component.extend({
	tag: 'lyme-data-view',
	template: template,
	viewModel: {
		define: {
			currCounty: { Value: can.Map },
			height: {
				type: 'number',
				value: 0
			}
		}
	}
});