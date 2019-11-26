//Development build
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist/'],
        browserify: {
            'dist/js/<%= pkg.name %>.js': ['src/js-compatible/<%= pkg.name %>.js'],
            options: {
                transform: [
                    ['browserify-css', {
                        global: true
                    }]
                ]
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['@babel/preset-typescript', '@babel/preset-env'],
                plugins: [
                    ["@babel/plugin-proposal-class-properties", {
                        "loose": true
                    }],
                    "@babel/plugin-proposal-object-rest-spread"
                ],
            },
            dist: {
                // files: {
                //     // 'src/js-compatible/pendulum.js': 'src/js/pendulum.js'
                    
                // }
                expand: true,
                src: ['**/*.js','**/*.ts'],
                cwd: 'src/js',
                dest: 'src/js-compatible',
                rename: function(dest, src){
                    return dest+'/'+src.replace('.ts','.js');
                }
            }
        },
        copy: {
            html: {
                expand: true,
                src: 'index.html',
                cwd: 'src',
                dest: 'dist'
            },
            // mathquill: {
            //     expand: true,
            //     src: 'mathquill.js',
            //     cwd: 'node_modules/mathquill/build/',
            //     dest: 'dist/js'
            // }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                sourceMap:true
            },
            files: {
                expand: true,
                src: 'dist/js/<%= pkg.name %>.js',
                dest: '.',
                rename:function(dest, src){
                    return dest+'/'+src.replace(".js",".min.js");
                }
            }
        },
        watch: {
            files: ['src/js/**', 'src/index.html', 'src/css/**'],
            tasks: ['default'],
            options: {
                spawn: true,
                interrupt: true,
                debounceDelay: 500
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-browserify');

     // Default performs a complete build from ground up to create the source
     grunt.registerTask('default', ['clean', 'babel', 'browserify', 'copy']);
     // Auto build starts a watching process to monitor and update build according to src/js
     grunt.registerTask('auto-build', ['watch']);
     // Build production code with an extra step of uglify
     grunt.registerTask('build-prod', ['clean', 'babel', 'browserify', 'copy', 'uglify']);
};