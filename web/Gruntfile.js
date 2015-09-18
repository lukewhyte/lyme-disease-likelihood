module.exports = function(grunt) {

	grunt.initConfig({
		"steal-build": {
			default: {
				options: {
					system: {
						config: __dirname + "/stealconfig.js",
						main: 'main'
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
	
	grunt.registerTask("build", ['sass_import', 'sass:dist', "steal-build"]);
	grunt.registerTask('dev', ['shell:mongo', 'express:dev', 'sass_import', 'sass:dev', 'watch']);

};
