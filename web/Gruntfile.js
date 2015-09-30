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
    	shell: {
		    mongo: {
		        command: "sh startMongoIfNotRunning.sh",
		        options: {
		            async: true
		        }
		    }
		},
		express:{
			dev: {
				options: {
					script: '../server/server.js'
				}
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
			express: {
				files:  [ '*.js' ],
				tasks:  [ 'express:dev' ],
				options: {
					spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
				}
			},
			sass: {
				files: ['main.scss', 'sass/*', 'js/components/**/*.scss'],
				tasks: ['sass_import', 'sass:dev']
			}
		}
	});
	
	grunt.loadNpmTasks("steal-tools");
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-shell-spawn');
	grunt.loadNpmTasks('grunt-sass-import');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-concat-css');
	
	grunt.registerTask("build", ['concat_css', 'sass_import', 'sass:dist', "steal-build"]);
	grunt.registerTask('dev', ['shell:mongo', 'express:dev', 'concat_css', 'sass_import', 'sass:dev', 'watch']);

};
