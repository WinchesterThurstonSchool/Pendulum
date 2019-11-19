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
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            files: {
                expand: true,
                src: 'dist/js/*.js',
                dest: '.'
            }
        },
        copy: {
            html: {
                src: 'index.html',
                cwd: 'src',
                dest: 'dist',
                expand: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');

    // Do grunt-related things in here
     grunt.registerTask('default', ['clean', 'browserify','uglify', 'copy']);
};