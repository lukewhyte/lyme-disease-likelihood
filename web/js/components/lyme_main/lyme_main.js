// utils
import can from 'can';

// views
import template from "./lyme_main.stache!";

// components
import '../lyme_nav/lyme_nav';
import '../lyme_map/lyme_map';
import '../lyme_data_view/lyme_data_view';

// models
import Cases from '../../models/cases';
import appState from '../../models/appState';

var def = Cases.findAll();

//routing
can.route(':page');
can.route(':page/:id', {
	'page': 'map',
	'id': 'main'
});
can.route.ready();

export default can.Component.extend({
    tag: "lyme-main",
    template: template,
    viewModel: {
        appState: appState,
        isMap: function () {
        	return can.route.attr('page') === 'map';
        },
        isCounty: function () {
        	return can.route.attr('page') === 'county';
        }
    },
    events: {
    	inserted: function () {
    		if (!can.route.attr('page')) {
    			can.route.attr('page', 'map');
    		}

    		def.then((counties) => {
    			var vm = this.viewModel,
    				appState = vm.attr('appState');
    			vm.attr('currCounty', can.route.attr('id'));
    			appState.attr('counties', counties.attr(0));
    			if (vm.attr('currCounty')) {
    				appState.attr('currCounty', appState.attr('counties')[vm.attr('currCounty')]);
    			}
    		});
    	}
    }
});