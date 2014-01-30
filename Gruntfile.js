
module.exports = function(grunt) {

    var d = __dirname+"/vendors/phantomizer-htmlcompressor";

    var in_dir = d+"/demo/in/";
    var out_dir = d+"/demo/out/";
    var meta_dir = d+"/demo/out/";



    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')

        // define some options for testing purpose
        ,"out_dir":out_dir
        ,"meta_dir":meta_dir
        ,"src_doc":[
            'lib/htmlcompressor.js',
            'tasks/build.js'
        ]

        //-
        ,'phantomizer-htmlcompressor': {
            options: {
                "compress-js":true,
                "compress-css":true
            }
            ,test: {
                options:{
                    "in_file": in_dir+"/index.html"
                    ,"out": "<%= out_dir %>/index.html"
                    ,"meta": "<%= meta_dir %>/index.html"
                }
            }
            ,keepcomments: {
                options:{
                    "in_file": in_dir+"/index.html"
                    ,"out": "<%= out_dir %>/index.html"
                    ,"meta": "<%= meta_dir %>/index.html"
                    ,"preserved_html_comments": "(?si)<!--.+?-->"
                }
            }
        },
        // end of testing options
        docco: {
            debug: {
                src: "<%= src_doc %>",
                options: {
                    layout:'linear',
                    output: 'documentation/'
                }
            }
        },
        "update-README":{
            options: {
                src: "<%= src_doc %>",
                base_doc_url: "http://maboiteaspam.github.io/phantomizer-htmlcompressor/"
            }
        },
        'gh-pages': {
            options: {
                base: '.',
                add: true
            },
            src: ['documentation/**']
        },
        release: {
            options: {
                // update the package json file version number or not
                bump: true, //default: true
                //file: 'component.json', //default: package.json
                // it is actually git add command
                add: false, //default: true
                // it is actually git commit command
                commit: false, //default: true
                // git tag  command
                // tag: false, //default: true
                // git push  command
                // push: false, //default: true
                // pushTags: false, //default: true
                npm: false, //default: true
                // true will apply the version number as the tag
                npmtag: true, //default: no tag
                // folder: 'folder/to/publish/to/npm', //default project root
                tagName: '<%= version %>', //default: '<%= version %>'
                // commitMessage: 'release <%= version %>', //default: 'release <%= version %>'
                //tagMessage: 'tagging version <%= version %>', //default: 'Version <%= version %>',
                github: {
                    repo: 'maboiteaspam/phantomizer-htmlcompressor', //put your user/repo here
                    usernameVar: 'GITHUB_USERNAME', //ENVIRONMENT VARIABLE that contains Github username
                    passwordVar: 'GITHUB_PASSWORD' //ENVIRONMENT VARIABLE that contains Github password
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-docco');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-release');
    grunt.registerTask('cleanup-grunt-temp', [],function(){
        var wrench = require('wrench');
        wrench.rmdirSyncRecursive(__dirname + '/.grunt', !true);
        wrench.rmdirSyncRecursive(__dirname + '/documentation', !true);
    });
    grunt.registerTask('update-README', [], function(){
        var path = require('path');
        var fs = require('fs');
        var README = fs.readFileSync(__dirname + "/README.md","utf-8");
        var options = this.options({
            src:[],
            base_doc_url:""
        })

        if( !README.match(/#\s+Documentation\s+Index/) ){
            README += "\n\n";
            README += "# Documentation Index\n\n";
            README += ""+options.base_doc_url+"\n\n";
            for( var n in options["src"] ){
                var file = options["src"][n];
                file = path.basename(file)
                file = file.replace(/([.]js|css)/, "")
                README += ""+options.base_doc_url+"documentation/"+file+".html\n\n";
            }
            README += "";
            fs.writeFileSync(__dirname + "/README.md",README);
        }

    });

    // to generate and publish the docco style documentation
    // execute this
    // grunt
    grunt.registerTask('default', ['docco','gh-pages', 'cleanup-grunt-temp', 'update-README']);

    // to release the project in a new version
    // use one of those commands
    // grunt --no-write -v release # test only
    // grunt release:patch
    // grunt release:minor
    // grunt release:major
    // grunt release:prerelease


    // testing purpose
    /*
     grunt.loadNpmTasks('phantomizer-htmlcompressor');
     grunt.registerTask('test',
     [
     'phantomizer-htmlcompressor:test'
     ]);
     */
};
