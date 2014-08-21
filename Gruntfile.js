// 'use strict';

module.exports = function(grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    var require_modules = (function(folders){
        var moduleNames = [];
        folders.forEach(function(folder){
            grunt.file.recurse('js/'+folder+'/',
                function(abspath, rootdir, subdir, filename){
                    if(/\.js$/.test(abspath)){
                        moduleNames.push({
                            name:folder+'/'+filename.replace(/\.js$/,'')
                        })
                    }
                }
            );
        });
        console.log(moduleNames)
        return moduleNames;
    })(['app']);

    grunt.initConfig({
        watch: {
            compass: {
                files: ['sass/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
            }
        },
        compass: {
            options: {
                sassDir: 'sass',
                cssDir: 'css',
                relativeAssets: false
            },
            dist:{
                options: {
                    force:true,
                    debugInfo: false,
                    noLineComments:true,
                    outputStyle: "compressed"
                }
            },
            server: {
                options: {
                    
                }
            }
        },
        requirejs:{
            app:{
                options:{
                    baseUrl:'.',
                    appDir:'js/',
                    paths:{
                        "underscore":"empty:"
                    },
                    mainConfigFile:'js/require.js',
                    dir:'build/',
                    optimize: "uglify",
                    optimizeAllPluginResources:true,
                    findNestedDependencies:true,
                    preserveLicenseComments: false,
                    throwWhen: {
                        optimize: true
                    },
                    modules:require_modules
                }
            }
        },
        clean: {
            options:{
                force: true
            },
            dist:{
                src:['../static']
            },
            build:{
                src:['./build/']
            }
        },
        copy:{
            options:{
                force: true
            },
            dist:{
                files:[{
                    expand:true,
                    cwd:'./build/',
                    dest: '../static/',
                    src:['**']
                },{
                    expand:true,
                    cwd:'./',
                    dest:'../static/',
                    src:['css/**']
                }]
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        concat:{
            options:{
                separator:'/*=========<%= pkg.name %>==============*/',
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            dist:{
                src:['./build/app/*.js'],
                dest:'./build/main.js'
            }
        },
        htmlmin: { 
            dist: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   
                    './build/index.html':'./index.html'
                }
            }
        },
        imagemin:{
            options: {
                optimizationLevel:3  //1~7
            },
            dynamic:{
                files:[{
                    expand:true,
                    cwd:'images/',
                    src:['**/*.{png,jpg,gif}'],
                    dest:'./build/images/'
                }]
            }
        }
    });
    grunt.registerTask('server',[
        'watch:compass',
        'compass:dist'
    ]);
    grunt.registerTask('dist',[
        'clean:dist',
        'compass:dist',
        'requirejs:app',
        'concat:dist',
        'htmlmin:dist',
        'imagemin:dynamic',
        'copy:dist',
        'clean:build'
    ])
};