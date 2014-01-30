'use strict';

module.exports = function(grunt) {

    var os = require('os');
    var htmlcompressor = require("../lib/htmlcompressor");
    var ph_libutil = require("phantomizer-libutil");


    // Task to compress one html file using phantomizer c&c
    grunt.registerMultiTask("phantomizer-htmlcompressor", "Compress html file", function () {

        //  init task options
        var options = this.options({
            // the file to compress
            in_file:'',
            // the file to write
            out:'',
            // the relative file path to save meta
            meta_file:'',
            // the base directory where the meta files are saved
            meta_dir:'',
            // the contents of preserve regexp to give to htmlcompressor
            preserved_html_comments:null
            /*
                + Any other options listed in lib/htmlcompressor
             */
        });
        var in_file = options.in_file;
        var out_file = options.out;
        var meta_file = options.meta_file;
        var meta_dir = options.meta_dir;

        grunt.verbose.writeflags(options, 'Options'); // debug call

        //  init compressor options for cli call
        var compressor_options = this.options({
            in_file:'',
            out:'',
            meta_file:'',
            meta_dir:'',
            preserved_html_comments:null
        });
        // clean it from undesired options that could pollute the command line call
        delete compressor_options.in_file;
        delete compressor_options.out;
        delete compressor_options.meta_file;
        delete compressor_options.meta_dir;
        delete compressor_options.preserved_html_comments;

        // create a new manager to check and save build status
        var meta_factory = ph_libutil.meta;
        var meta_manager = new meta_factory( process.cwd(), meta_dir );

        // how was called this task : htmlcompressor:some_param
        var current_grunt_task  = this.nameArgs;
        // save current options status to regenerate
        var current_grunt_opt = this.options();

        // if the build file does not exists or is out of date
        if( meta_manager.is_fresh(meta_file, current_grunt_task) == false ){

            // then generate the output file again, or for the first time
            var done = this.async();

            // transforms preserved_html_comments regexp string into a file for htmlcompressor binary
            if( options.preserved_html_comments != "" ){
                compressor_options.preserve = os.tmpdir()+"/preserved_html_comments";
                grunt.file.write(compressor_options.preserve, options.preserved_html_comments);
            }

            // invoke htmlcompressor binary, a jar file
            htmlcompressor(compressor_options, in_file,
                function(err, output, code) {
                    if (err) {
                        // log error
                        grunt.log.error(code);
                        grunt.log.error(err);
                        grunt.log.warn(output);
                        grunt.fail.warn('htmlcompressor failed to compress html.');
                        //  follow up the problematic issue we found
                        done(false);
                    } else {
                        // saves output file
                        grunt.file.write(out_file, output.stdout);
                        grunt.log.ok('File "' + out_file + '" created.');

                        // load/create a meta entry
                        var entry = meta_manager.load(meta_file);
                        // add User land Grunt file to the list of dependency
                        if ( grunt.file.exists(process.cwd()+"/Gruntfile.js")) {
                            entry.load_dependencies([process.cwd()+"/Gruntfile.js"])
                        }
                        // add in_file as a dependency
                        entry.load_dependencies([in_file, __filename]);
                        // save that task step to the meta in order to regenerate output file
                        entry.require_task(current_grunt_task, current_grunt_opt);
                        // save the meta
                        entry.save(meta_file, function(err){
                            if (err){
                                // log error
                                grunt.log.error(err);
                                //  follow up the problematic issue we found
                                done(false);
                            }else{
                                done();
                            }
                        })
                    }
                });

        }else{
            grunt.log.ok("the build is fresh")
            grunt.verbose.or.write("\t"+out)
        }
    });

    // Task to compress a directory of html files
    grunt.registerMultiTask("phantomizer-dir-htmlcompressor", "Compress a directory of html files", function () {

        //  init task options
        var options = this.options({
            // the directory containing source files
            in_dir:'',
            // the contents of preserve regexp to give to htmlcompressor
            preserved_html_comments:''
            /*
                + Any other options listed in lib/htmlcompressor
             */
        });
        var in_dir = options.in_dir;


        //  init compressor options for cli call
        var compressor_options = this.options({
                preserve:null,
                output:in_dir,
                recursive:true
        });
        // clean it from undesired options that could pollute the command line call
        delete compressor_options.in_dir;
        delete compressor_options.meta_dir;
        delete compressor_options.preserved_html_comments;

        // debug call
        grunt.verbose.writeflags(options, 'Options');

        // transforms preserved_html_comments regexp string into a file for htmlcompressor binary
        if( options.preserved_html_comments != "" ){
            compressor_options.preserve = os.tmpdir()+"/preserved_html_comments";
            grunt.file.write(compressor_options.preserve, options.preserved_html_comments);
        }

        // it is an async task
        var done = this.async();

        // invoke htmlcompressor binary, a jar file
        htmlcompressor(compressor_options, in_dir,
            function(err, output, code) {
                if (err) {
                    // log error
                    grunt.log.error(code);
                    grunt.log.error(err);
                    grunt.log.warn(output);
                    grunt.fail.warn('htmlcompressor failed to compress html.');
                    //  follow up the problematic issue we found
                    done(false);
                } else {
                    grunt.log.ok("htmlcompressor done");
                    done();
                }
            });
    });
};