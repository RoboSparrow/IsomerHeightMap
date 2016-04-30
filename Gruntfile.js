module.exports = function(grunt) {

    ////
    // configure project
    ////

    var CONF = {

        // task: concat
        concat: {
            // name slug for the concated js file (i.e app.js, app.css, app.min.js)
            destSlug: '<%= pkg.name %>.combined', //destSlug: 'app'
            // debug: print src file paths as comments
            printPath: true,
            // glob patterns and order for file concat tasks
            files:{
                js: ['image-heightmap.js', 'isomer-heightmap.js', 'three-heightmap.js'],     // main file on top
                css: []   // main file on top
            }
        },

        // jhint options, some of the listed are default already buty listed here to be easily edited
        jshint: {
            options: {
                esversion: 5,
                curly: true,
                funcscope: true,
                undef: true,
                unused: true,
                jquery: false,
                browser: true,
                globals: {
                    console: true,
                    module: true,
                    document: true
                }
            }
        }

    };

    ////
    // grunt config
    ////

    grunt.initConfig({
        
        CONF: CONF,

        pkg: grunt.file.readJSON('package.json'),

        // banner
        meta: {
            banner: [
                '/**',
                ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>',
                ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>',
                ' */',
                ''
            ].join("\n")
        },

        // concat files
        concat: {
            // js
            js:{
                options: {
                    separator: '\n',
                    banner: '<%= meta.banner %>\n',
                    process: function(src, filepath) {
                        return (CONF.concat.printPath) ? '/*' + filepath + '*/\n\n' + src : src;
                    }
                },
                src: CONF.concat.files.js,
                dest: 'dist/' + CONF.concat.destSlug + '.js'
            },
            // css
            css:{
                options: {
                    separator: '\n',
                    banner: '<%= meta.banner %>\n',
                    process: function(src, filepath) {
                        return (CONF.concat.printPath) ? '/*' + filepath + '*/\n\n' + src : src;
                    }
                },
                src: CONF.concat.files.css,
                dest: 'dist/' + CONF.concat.destSlug + '.css'
            }
        },

        // copy files
        copy: {
            // js copy files (no concat)
            js: {
                expand: true,
                cwd: 'src/',
                src: ['*.js'],
                dest: 'dist/'
            },
            // js copy files (no concat)
            js_vendor: {
                flatten: true,
                expand: true,
                cwd: 'bower_components/',
                src: [
                    'threejs/build/three.min.js',
                    'threejs/examples/js/controls/TrackballControls.js',
                    'isomer/dist/isomer.min.js'
                ],
                dest: 'dist/vendor/'
            },
            // css copy files (no concat)
            css: {
                src: [],
                dest: 'dist/'
            },
            // html
            html: {
                expand: true,
                cwd: 'src/',
                src: ['**/*.html'],
                dest: 'dist/'
            },
            // assets
            assets: {
                expand: true,
                cwd: 'src/page/',
                src: ['**/*.*'],
                dest: 'dist/page/'
            }

        },

        // clean dist folder (before build)
        clean: {
            build: {
                src: ['dist/**']
            }
        },

        // uglify js
        uglify: {
            js: {
                options: {
                    banner: '<%= meta.banner %>\n'
                },
                files: {
                    'dist/<%= CONF.concat.destSlug %>..min.js': ['<%= concat.js.dest %>']
                }
            }
        },

        // jshint: specify your preferred options in 'globals'
        // http://jshint.com/docs/options/
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: CONF.jshint.options
        },

        // configure watch task
        watch: {
            files: ['<%= jshint.files %>', 'src/**/*.css', 'src/**/*.html'],
            tasks: ['jshint', 'concat', 'copy', 'replace']
        },

        // string replacments
        replace: {
            // index.html
            'index.html': {
                options: {
                    patterns: [{
                        match: 'package',
                        replacement: '<%= CONF.concat.destSlug %>'
                    }, {
                        match: 'version',
                        replacement: '<%= pkg.version %>'
                    }]
                },
                files: [{
                    src: ['dist/index.html'],
                    dest: 'dist/index.html'
                }]
            }
        }

    }); // end grunt.initConfig

    ////
    // grunt tasks
    ////

    // requirements

    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // custom tasks (mind the order of your tasks!), just comment out what you don't need
    grunt.registerTask(
        'default',
        'Compiles all of the assets and copies the files to the build directory.', [
            'clean',
            'jshint',
            'concat',
            'copy',
            'replace',
            'uglify'
        ]
    );

}; // end module.exports
