'use strict';

module.exports = function(grunt) {


    grunt.registerMultiTask("phantomizer-htmlcompressor", "Compress html file", function () {

        var ph_libutil = require("phantomizer-libutil")
        var os = require('os')
        var htmlcompressor = require("../lib/htmlcompressor")

        var meta = ph_libutil.meta
        var meta_manager = new meta( process.cwd() )

        var options = this.options();
        var in_file = options.in_file;
        var out_file = options.out;
        var meta_file = options.meta;

        var compressor_options = this.options(
            {preserve:null}
        );
        delete compressor_options.in_file
        delete compressor_options.out
        delete compressor_options.meta
        delete compressor_options.preserved_html_comments

        grunt.verbose.writeflags(options, 'Options'); // debug call

        if( meta_manager.is_fresh(meta_file) == false ){

            var entry = meta_manager.create([])
            var done = this.async();
            if( options.preserved_html_comments != "" ){
                compressor_options.preserve = os.tmpdir()+"/preserved_html_comments"
                grunt.file.write(compressor_options.preserve, options.preserved_html_comments);
            }


            var current_grunt_task = this.nameArgs
            var current_grunt_opt = this.options()

            htmlcompressor(compressor_options, in_file,
                function(err, output, code) {
                    if (err) {
                        grunt.log.error(err);
                        console.log(output)
                        grunt.fail.warn('htmlcompressor failed to compress html.');
                        done(false);
                    } else {
                        grunt.file.write(out_file, output.stdout);
                        grunt.log.ok('File "' + out_file + '" created.');

                        if ( grunt.file.exists(process.cwd()+"/Gruntfile.js")) {
                            entry.load_dependencies([process.cwd()+"/Gruntfile.js"])
                        }
                        entry.load_dependencies([in_file, __filename])

                        entry.require_task(current_grunt_task, current_grunt_opt)
                        entry.save(meta_file, function(err){
                            if (err) done(false);
                            else done();
                        })
                    }
                });

        }else{
            grunt.log.ok("the build is fresh")
        }
    });
};