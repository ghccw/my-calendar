module.exports = function(grunt) {
	grunt.initConfig({
		log: {
			jshint: 'jshint'
		},
		pkg: grunt.file.readJSON('package.json'),
		config: grunt.file.readJSON('gruntconfig.json'),
		//编译SASS
		sass: {
			options: {
				style: 'compressed', // nested, expanded, compact, compressed
				precision: 5,
				//banner: '/*CSS自动文件 最后修改日期： <%= grunt.template.today("yyyy-mm-dd")%>*/'
			},
			// web: {手动
			// 	files: {
			// 		//'D:/trunk/TRManager/Beyond.Image/css/v2.0/bankOfChina/bankOfChina.css':'stylesheet/scss/bankOfChina.scss'
			// 	}
			// },
			all: {
				// Grunt will search for "**/?.js" under "lib/" when the "minify" task runs 
				files: [{
					expand: true, //启用动态扩展
					cwd: 'stylesheet/sass/', //批匹配相对lib目录的src来源
					src: '*.scss', //实际的匹配模式
					dest: 'D:/Code/channel-nodejs-projects/channel-cps/public/stylesheets/', //目标路径前缀
					ext: '.css' //目标文件路径中文件的扩展名.
				}]
			}
		},

		//JShint检测
		jshint: {
			files: ['src/*.js'],
			options: {
				// more options here if you want to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true,
					//大括号包裹
					curly: true,
					//对于简单类型，使用===和!==，而不是==和!=
					eqeqeq: true,
					//对于首字母大写的函数（声明的类），强制使用new
					newcap: true,
					//禁用arguments.caller和arguments.callee
					noarg: true,
					//对于属性使用aaa.bbb而不是aaa['bbb']
					sub: true,
					//查找所有未定义变量
					undef: true,
					//查找类似与if(a = 0)这样的代码
					boss: true,
					//指定运行环境为node.js
					node: true
				}
			}
		},
		//压缩文件
		uglify: {
			dynamic_mappings: {
				// Grunt will search for "**/?.js" under "lib/" when the "minify" task runs 
				files: [{
					expand: true, //启用动态扩展
					cwd: 'dest/', //批匹配相对lib目录的src来源
					src: '*.js', //实际的匹配模式
					dest: 'build/', //目标路径前缀
					ext: '.min.js' //目标文件路径中文件的扩展名.
				}]
			},
			options: {
				banner: '/*\n  Name:MyCalendar V 1.0.0 \n  Date:<%=grunt.template.today("yyyy-mm-dd hh:mm:ss") %>\n  Github:https://github.com/lengjh/my-calendar\n*/\n\n',
				compress: false,
				//beautify: true,
				mangle: false,
				sourceMapIn: true
			},
			//static_mappings: {
			// files: {
			// 	'build/lib/jquery-rotae.min.js': 'src/lib/jquery-rotae.js',
			// 	'build/lib/require.min.js': 'src/lib/require.js',
			// 	'build/lib/html5.min.js': 'src/lib/html5.js',
			// 	'build/lib/jquery-1.9.0.min.js': 'src/lib/jquery-1.9.0.js',
			// 	'build/lib/jquery-1.7.2.min.js': 'src/lib/jquery-1.7.2.js',
			// 	'build/lib/jquery.easing.1.3.min.js': 'src/lib/jquery.easing.1.3.js',
			// 	'build/lib/jquery-tmpl.min.js': 'src/lib/jquery-tmpl.js',
			// }
			//},
			// v2: {
			// 	files: [{
			// 		expand: true, //启用动态扩展
			// 		cwd: 'src/', //批匹配相对lib目录的src来源
			// 		src: '*.js', //实际的匹配模式
			// 		dest: 'D:/V2.0/TRManager/Beyond.Image/js/v2.0/n', //目标路径前缀
			// 		ext: '.min.js' //目标文件路径中文件的扩展名.
			// 	}]
			// }
			// build: {
			// 	// src: 'js/*.js',
			// 	// dest: 'build/<%=pkg.name%>.min.js'
			// 	files: {
			// 		//'build/dialog.js': 'js/dialog.js'
			// 	}
			// }
		},

		//合并
		concat: {
			foo: {
				files: {
					'dest/my-calendar.js': ['src/kingwell.js', 'src/calendar.js']
				}
			}
			// dist: {
			// 	src: ['build/plugins.min.js', 'build/jquery-plugins.min.js', 'build/dialog.min.js', 'build/kSlide.min.js'],
			// 	dest: 'build/plugins-all.js'
			// }
		},
		// requirejs: {
		// 	compile: {
		// 		options: {
		// 			baseUrl: "src/",
		// 			mainConfigFile: "src/requirejs-config.js",
		// 			out: 'dest/',
		// 			// done: function(done, output) {
		// 			// 	var duplicates = require('rjs-build-analysis').duplicates(output);

		// 			// 	if (duplicates.length > 0) {
		// 			// 		grunt.log.subhead('Duplicates found in requirejs build:');
		// 			// 		grunt.log.warn(duplicates);
		// 			// 		done(new Error('r.js built duplicate modules, please check the excludes option.'));
		// 			// 	}

		// 			// 	done();
		// 			// }
		// 		}
		// 	}
		// },		
		// clean: {
		// 	empty: {
		// 		src: ['temp/**/*'],
		// 		filter: '*'
		// 	},
		// 	emptyFolder: {
		// 		src: ['temp/**/*'],
		// 		filter: function(filepath) {
		// 			return (grunt.file.isDir(filepath) && require('fs').readdirSync(filepath).length === 0);
		// 		}
		// 	}
		// },
		// qunit: {
		// 	files: ['test/**/*.html']
		// },
		// connect: {
		// 	client: {
		// 		options: {
		// 			port: 80,
		// 			hostname: '10.10.100.30',
		// 			base: '',
		// 			middleware: livereloadMiddleware
		// 		}
		// 	}
		// },
		copy: {
			// cssImage: {
			// 	//src: 'stylesheet/css/images/*',
			// 	//dest: 'D:/V2.0/TRManager/Beyond.Image/css/v2.0/n/',
			// 	expand: true,
			// 	cwd: 'stylesheet/css/images/',
			// 	src: '**',
			// 	dest: 'D:/V2.0/TRManager/Beyond.Image/css/v2.0/n/images/',
			// 	flatten: true,
			// 	filter: 'isFile'
			// },
			// lib: {
			// 	expand: true,
			// 	cwd: 'build/lib/',
			// 	src: '**',
			// 	dest: 'D:/V2.0/TRManager/Beyond.Image/js/lib/',
			// 	flatten: true,
			// 	filter: 'isFile'
			// },
			// build: {
			// 	expand: true,
			// 	cwd: 'build/',
			// 	src: '**',
			// 	dest: 'D:/V2.0/TRManager/Beyond.Image/js/v2.0/n',
			// 	flatten: true,
			// 	filter: 'isFile'
			// },
			// pageImgage:{
			// 	expand: true,
			// 	cwd: 'dev/images/',
			// 	src: '**',
			// 	dest: 'D:/V2.0/TRManager/Beyond.Image/images/v2.0/n',
			// 	//flatten: true,
			// 	//filter: 'isFile'
			// }
		},
		less: {
			development: {
				files: {
					//"D:/Hzins/channel-cps/public/stylesheets/main.css": "stylesheet/less/main.less"
				}
			}

		},
		//监听
		watch: {
			// copyImages: {
			// 	files: ['stylesheet/css/images/*.*'],
			// 	//files: ['stylesheet/scss/*.scss', 'src/**/*.js'],
			// 	tasks: ['copy:cssImage'],
			// },
			// copyLib: {
			// 	files: ['build/lib/*.*'],
			// 	tasks: ['copy:lib']
			// },
			// copyBuild: {
			// 	files: ['build/*.js'],
			// 	tasks: ['copy:build']
			// },
			// copyImagePage: {
			// 	files: ['dev/images/**.*'],
			// 	tasks: ['copy:pageImgage']
			// },
			defaults: {
				//files: ['stylesheet/scss/*.scss'],
				files: ['stylesheet/sass/*.scss'],
				//tasks: ['sass', 'jshint', 'uglify', 'concat'],
				tasks: ['sass']
			}

		},
	});
	//加载插件
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.loadNpmTasks('grunt-contrib-copy');
	//grunt.loadNpmTasks('grunt-contrib-requirejs');
	// grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	//grunt.loadNpmTasks('connect-livereload');
	//grunt.loadNpmTasks('grunt-nodemon');	;
	grunt.loadNpmTasks('grunt-contrib-watch');
	//grunt.registerTask('live', ['watch']);
	//grunt.registerTask('default', ['jshint', 'uglify', 'concat', 'clean', 'watch']);
	// grunt.registerMultiTask('log', 'Log stuff.', function() {
	// 	grunt.log.writeln(this.target + ': --------------' + this.data);
	// });
	//注册任务
	//grunt.registerTask('default', ['sass', 'jshint', 'uglify', 'watch']);
	grunt.registerTask('default', ['concat', 'uglify']);
}