//Development build
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist/'],
        browserify: {
            'dist/js/<%= pkg.name %>.js': ['src/js/<%= pkg.name %>.js'],
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
                presets: ['@babel/preset-env']
            },
            dist: {
                files: {
                    'dist/js/<%= pkg.name %>-compatible.js': 'dist/js/<%= pkg.name %>.js'
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
                src: 'dist/js/pendulum-compatible.js',
                dest: '.',
                rename:function(dest, src){
                    return dest+'/'+src.replace(".js",".min.js");
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-browserify');

    // Do grunt-related things in here
     grunt.registerTask('default', ['clean', 'browserify', 'copy']);
     grunt.registerTask('product', ['clean', 'browserify', 'babel', 'copy', 'uglify']);
};