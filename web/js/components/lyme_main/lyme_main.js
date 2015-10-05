// utils
import can from 'can';
import 'can/map/define/define';
import _ from 'lodash';

// views
import template from "./lyme_main.stache!";

// components
import '../lyme_nav/lyme_nav';
import '../lyme_map/lyme_map';
import '../lyme_data_view/lyme_data_view';
import '../lyme_nationwide/lyme_nationwide';
import '../lyme_about/lyme_about';

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
        define: {
            instructions: { value: false, type: 'boolean' },
            isLoading: { 
                value: true, 
                type: 'boolean',
                set: function (val) {
                    if (!val) {
                        this.attr('instructions', true);
                    }
                    return val;
                }
            }
        },
        appState: appState,
        isMap: function () {
        	return can.route.attr('page') === 'map';
        },
        isCounty: function () {
        	return can.route.attr('page') === 'county';
        },
        isNationwide: function () {
            return can.route.attr('page') === 'nationwide';
        },
        isAbout: function () {
            return can.route.attr('page') === 'about';
        }
    },
    events: {
    	inserted: function () {
            this.viewModel.attr('appState').attr('height', $(window).height() - $('lyme-nav').height());

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
    	},
        'click': function () {
            if (!this.viewModel.attr('loading')) {
                this.viewModel.attr('instructions', false);
            }
        }
    }
});