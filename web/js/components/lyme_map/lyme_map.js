// utils
import can from 'can';
import $ from 'jquery';
import 'can/map/define/define';
import d3 from 'd3';
import mapFactory from './map_factory';
import addUSLeafletOverlay from './add_us_overlay';

// views
import template from "./lyme_map.stache!";

//components
import '../lyme_data_overlay/lyme_data_overlay';

var map = null,
	$mapWrap = $('<div id="map"></div>'); // create element to hold map that will persist in other states

export default can.Component.extend({
    tag: "lyme-map",
    template: template,
    viewModel: {
        define: {
        	map: { 
        		type: '*',
        		value: null
        	},
        	counties: {
        		value: null
        	},
        	height: {
        		type: 'number',
        		value: 0
        	}
        },

        mapAPI: function () {
        	return mapFactory({
				center: [40.380, -95.669],
				zoom: 5,
				height: this.attr('height'),
				minZoom: 3,
				maxZoom: 19,
				g: false
			});
        }
    },
    events: {
    	inserted: function () {
    		this.element.append($mapWrap.css('width', this.element.width()));
    		this.viewModel.attr('height', $(window).height() - $('lyme-nav').height());

    		if (!map) { // only instantiate map once
    			map = this.viewModel.mapAPI();
    			map.addUSLeafletOverlay = addUSLeafletOverlay(map);
    		}

    		this.viewModel.attr('map', map);
    	}
    }
});

