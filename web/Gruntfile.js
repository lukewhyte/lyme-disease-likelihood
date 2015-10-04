module.exports = function(grunt) {

	grunt.initConfig({
		"steal-build": {
			default: {
				options: {
					system: {
						config: __dirname + "/package.json!npm",
						main: 'main'
					},
					buildOptions: {
						bundleSteal: true
					}
				}
			}
		},
		'http-server': {
	        dev: {
	            port: 9876,
	            // run in parallel with other tasks 
	            runInBackground: true,
	        }
	    },
		sass_import: {
			options: {},
			dist: {
				files: {
					'main.scss': ['sass/*', 'js/components/**/*']
				}
			}
		},
		sass: {                       
			dev: {                        
				options: {                     
					style: 'expanded'
				},
				files: {                     
					'dev.css': 'main.scss', 
				}
			},
			dist: {
				options: {                     
					style: 'compressed'
				},
				files: {                     
					'main.css': 'main.scss', 
				}
			}
		},
		concat_css: {
			all: {
				src: ['bower_components/normalize-css/normalize.css', 
					  'node_modules/leaflet/dist/leaflet.css', 
					  'bower_components/qtip2/jquery.qtip.min.css',
					  'node_modules/c3/c3.min.css'],
				dest: 'sass/deps.css'
			}
		},
		watch: {
			sass: {
				files: ['main.scss', 'sass/*', 'js/components/**/*.scss'],
				tasks: ['sass_import', 'sass:dev']
			}
		}
	});
	
	grunt.loadNpmTasks("steal-tools");
	grunt.loadNpmTasks('grunt-http-server');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass-import');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-concat-css');
	
	grunt.registerTask("build", ['http-server', 'concat_css', 'sass_import', 'sass:dist', "steal-build"]);
	grunt.registerTask('dev', ['concat_css', 'sass_import', 'sass:dev', 'watch']);

};
