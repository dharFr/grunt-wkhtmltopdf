/*
 * grunt-wkhtmltopdf
 * https://github.com/dhar/grunt-wkhtmltopdf
 *
 * Copyright (c) 2012 Olivier Audard
 * Licensed under the MIT license.
 */
/*globals module:false, require:false*/
module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================
  var helper = require('./lib/wkhtmltopdf-lib').init(grunt);

  grunt.registerTask('wkhtmltopdf', 'Your task description goes here.', function() {
    grunt.config.requires('wkhtmltopdf.src');
    grunt.config.requires('wkhtmltopdf.dest');

    var conf = grunt.config('wkhtmltopdf');

    var htmlFiles = grunt.file.expandFiles(conf.src),
        dest = (conf.dest && conf.dest !== '') ? conf.dest + '/' : '';

    grunt.log.writeln("pdf output is: " + dest);

    htmlFiles.forEach(function(srcpath) {
      var dir = dest + srcpath.replace(/.*\/([^\/]+)\/[^\/]+\.html/, '$1');

      // Create dest folder as wkhtmltopdf won't generate output if it doesn't exist
      grunt.file.mkdir(dir);
      var destpath  = dir + '/' +
          srcpath.replace(/.*\/([^\/]+)\.html/, '$1.pdf');

      // Launch PhantomJS.
      helper.convert({
        code: 90,
        args: [
            '--dpi', '96',        // workarround to wkhtmltopdf letter-spacing bug (see http://code.google.com/p/wkhtmltopdf/issues/detail?id=72)
            '--print-media-type', // Use @print media type
            srcpath,
            destpath
          ],
        done: function(err) {
          if (err) {
            grunt.log('>>>', err);
          }
        }
      });
    });
  });
};
