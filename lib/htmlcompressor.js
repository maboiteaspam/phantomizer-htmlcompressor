/**
 * This source was largely inspired by
 *
 * grunt-htmlcompressor
 * https://github.com/jney/grunt-htmlcompressor
 *
 * Copyright (c) 2012 Jean-Sébastien Ney
 * Licensed under the MIT license.
 */

/*global _:true, __dirname */

var htmlcompressor = module.exports = (function(){

    // returns a compressor function
	var compressor = function ( options, srcFile, cb ){

        var grunt = require('grunt');

        var _ = grunt.util._;

        // options are promptly passed on the command line
		options = options || {
            /*
             Global Options:
             -?, /?, -h, --help            Displays this help screen
             -t, --type <html|xml>         If not provided autodetects from file extension
             -r, --recursive               Process files inside subdirectories
             -c, --charset <charset>       Charset for reading files, UTF-8 by default
             -m, --mask <filemask>         Filter input files inside directories by mask
             -o, --output <path>           Filename or directory for compression results. If none provided outputs result to <stdout>
             -a, --analyze                 Tries different settings and displays report. All settings except --js-compressor are ignored

             XML Compression Options:
             --preserve-comments           Preserve comments
             --preserve-intertag-spaces    Preserve intertag spaces

             HTML Compression Options:
             --preserve-comments           Preserve comments
             --preserve-multi-spaces       Preserve multiple spaces
             --preserve-line-breaks        Preserve line breaks
             --remove-intertag-spaces      Remove intertag spaces
             --remove-quotes               Remove unneeded quotes
             --simple-doctype              Change doctype to <!DOCTYPE html>
             --remove-style-attr           Remove TYPE attribute from STYLE tags
             --remove-link-attr            Remove TYPE attribute from LINK tags
             --remove-script-attr          Remove TYPE and LANGUAGE from SCRIPT tags
             --remove-form-attr            Remove METHOD="GET" from FORM tags
             --remove-input-attr           Remove TYPE="TEXT" from INPUT tags
             --simple-bool-attr            Remove values from boolean tag attributes
             --remove-js-protocol          Remove "javascript:" from inline event handlers
             --remove-http-protocol        Remove "http:" from tag attributes
             --remove-https-protocol       Remove "https:" from tag attributes
             --remove-surrounding-spaces <min|max|all|custom_list> Predefined or custom comma separated list of tags
             --compress-js                 Enable inline JavaScript compression
             --compress-css                Enable inline CSS compression using YUICompressor
             --js-compressor <yui|closure> Switch inline JavaScript compressor between YUICompressor (default) and Closure Compiler

             JavaScript Compression Options for YUI Compressor:
             --nomunge                     Minify only, do not obfuscate
             --preserve-semi               Preserve all semicolons
             --disable-optimizations       Disable all micro optimizations
             --line-break <column num>     Insert a line break after the specified column

             JavaScript Compression Options for Google Closure Compiler:
             --closure-opt-level <simple|advanced|whitespace> Sets level of optimization (simple by default)
             --closure-externs <file>      Sets custom externs file, repeat for each file
             --closure-custom-externs-only Disable default built-in externs

             CSS Compression Options for YUI Compressor:
             --line-break <column num>     Insert a line break after the specified column

             Custom Block Preservation Options:
             --preserve-php                Preserve <?php ... ?> tags
             --preserve-server-script      Preserve <% ... %> tags
             --preserve-ssi                Preserve <!--# ... --> tags
             -p, --preserve <path>         Read regular expressions that define custom preservation rules from a file

             Please note that if you enable CSS or JavaScript compression, additional
             YUI Compressor or Google Closure Compiler jar files must be present
             in the same directory as this jar.
             */
        };
        var allowed_options = [
            'type',
            'recursive',
            'charset',
            'mask',
            'output',
            'analyze',
            'preserveComments ',
            'intertagSpaces',
            'preserveMultiSpaces',
            'preserveLineBreaks',
            'removeQuotes',
            'simpleDoctype',
            'removeStyleAttr',
            'removeLinkAttr',
            'removeScriptAttr',
            'removeFormAttr',
            'removeInputAttr',
            'simpleBoolAttr',
            'removeJsProtocol',
            'removeHttpProtocol',
            'removeHttpsProtocol',
            'removeSurroundingSpaces',
            'compressJs',
            'compressCss',
            'jsCompressor',
            'nomunge',
            'preserveSemi',
            'disableOptimizations',
            'lineBreak',
            'preservePhp',
            'preserveServerScript',
            'preserveSsi',
            'preserve'
        ];

        // location of the enbedded htmlcompressor binary
		var jar = __dirname + '/../ext/htmlcompressor-1.5.3.jar';

        // remove unexpected options to htmlcompressor
        for( var n in options ){
            if( allowed_options.indexOf(n) == -1 ){
                delete options[n];
            }
        }

        // join into a string the required parameters to invoke the external htmlcompressor
		var args = _.flatten(['-jar', jar, _.map(options, toParameter), srcFile]);

        // invoke now the external jar file thru java
		grunt.util.spawn({
		  cmd: 'java',
		  args: args
		}, cb);
	};

    return compressor;



    // Convert a pair of key/value to an array
    // if the value is `true` only the key is kept
    //
    // Example:
    //
    //   toParameter('lineBreak', 2)
    //   // => ['--line-break', 2]
    //
    //   toParameter('preserveComments', true)
    //   // => ['--preserve-comments']
    function toParameter(val, key) {
        var str = '--' + key.replace(/([A-Z])/g, function(a) {
            return '-' +  a.toLowerCase();
        });

        return (val === true) ? [str] : [str, val];
    }

})();
