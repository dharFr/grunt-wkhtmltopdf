/*
 * grunt-wkhtmltopdf
 * https://github.com/dhar/grunt-wkhtmltopdf
 *
 * Copyright (c) 2012 Olivier Audard
 * Licensed under the MIT license.
 */
/*globals module:false*/
module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

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
      grunt.helper('wkhtmltopdf', {
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

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('wkhtmltopdf', function(options) {

    if (!options || !options.args) {
      grunt.warn("You need to specify atleast one input file, and exactly one output file");
      return null;
    }

    return grunt.utils.spawn({
      cmd: 'wkhtmltopdf',
      args: options.args
    }, function(err, result, code) {
      grunt.log.writeln('wkhtmltopdf done');
      if (!err) { return options.done(null); }
      // Something went horribly wrong.
      grunt.verbose.or.writeln();
      grunt.log.write('Running wkhtmltopdf...').error();
      if (code === 127) {
        grunt.log.errorlns(
          'In order for this task to work properly, wkhtmltopdf must be ' +
          'installed and in the system PATH (if you can run "wkhtmltopdf" at' +
          ' the command line, this task should work). Unfortunately, ' +
          'wkhtmltopdf cannot be installed automatically via npm or grunt. '
        );
        grunt.warn('wkhtmltopdf not found.', options.code);
      } else {
        result.split('\n').forEach(grunt.log.error, grunt.log);
        grunt.warn('wkhtmltopdf exited unexpectedly with exit code ' + code + '.', options.code);
      }
      options.done(code);
    });
  });

};
