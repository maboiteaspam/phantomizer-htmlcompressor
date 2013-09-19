/*
 * grunt-htmlcompressor
 * https://github.com/jney/grunt-htmlcompressor
 *
 * Copyright (c) 2012 Jean-Sébastien Ney
 * Licensed under the MIT license.
 */

/*global _:true, __dirname */

var htmlcompressor = module.exports = (function(){

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
	
	
	return function ( options, srcFile, cb ){
		var grunt = require('grunt');
		var _ = grunt.util._;
		options = options || {};

		grunt.verbose.writeflags(options, 'Options');

		var jar = __dirname + '/../ext/htmlcompressor-1.5.3.jar';
		var processName = options.processName;

		delete options.processName;

		var args = _.flatten(['-jar', jar, _.map(options, toParameter), srcFile]);

		grunt.util.spawn({
		  cmd: 'java',
		  args: args
		}, cb);
	}

})();
