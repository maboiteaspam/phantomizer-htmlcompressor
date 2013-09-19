
module.exports = function(grunt) {

    var d = __dirname+"/vendors/phantomizer-htmlcompressor";

    var in_dir = d+"/demo/in/";
    var out_dir = d+"/demo/out/";
    var meta_dir = d+"/demo/out/";



    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')

        ,"out_dir":out_dir
        ,"meta_dir":meta_dir

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
                    ,"meta": "<%= meta_dir %>/index.html.meta"
                }
            }
            ,keepcomments: {
                options:{
                    "in_file": in_dir+"/index.html"
                    ,"out": "<%= out_dir %>/index.html"
                    ,"meta": "<%= meta_dir %>/index.html.meta"
                    ,"preserved_html_comments": "(?si)<!--.+?-->"
                }
            }
        }
    });

    grunt.loadNpmTasks('phantomizer-htmlcompressor');

    grunt.registerTask('default',
        [
            'phantomizer-htmlcompressor:test'
        ]);
};
