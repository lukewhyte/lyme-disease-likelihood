System.config({
	"map": {
        "jquery/jquery": "jquery",
        "can/util/util.js": "can/util/jquery/jquery.js"
    },
	paths: {
		"can/*": "node_modules/can/*.js",
        can: "node_modules/can/can.js",
        jquery: 'bower_components/jquery/dist/jquery.js',
        lodash: 'bower_components/lodash/lodash.min.js',
        d3: 'bower_components/d3/d3.min.js',
        c3: 'node_modules/c3/c3.min.js',
        appState: 'js/models/appState.js'
	},
	ext: {
    	stache: 'can/view/stache/system'
    },
    meta: {
        jquery: { exports: "jQuery" },
        d3: { exports: "d3" }
    }
});
System.buildConfig = {
    map: {
        "can/util/util": "can/util/domless/domless"
    }
};