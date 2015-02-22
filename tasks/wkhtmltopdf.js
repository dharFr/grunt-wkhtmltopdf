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

  grunt.registerMultiTask('wkhtmltopdf', 'Your task description goes here.', function() {

    // using grunt async support so we can be sure task doesn't
    // end before PDF processing does: http://gruntjs.com/api/inside-tasks
    var done = this.async(),
        files = this.files;

    // iterate through each file grouping
    files.forEach(function(file, filesIndex) {

      var pathlib = require('path');
      // calculate the destination directory and ensure it exists, since
      // wkhtmltopdf won't create the PDF if the destination directory doesn't
      // exist
      var destPath = file.dest;
      if (grunt.file.isFile(file.dest)) {
        destPath = pathlib.dirname(file.dest);
      }
      grunt.file.mkdir(destPath);

      file.src.forEach(function(src, srcIndex) {

        var dest = file.dest;
        // wkhtmltopdf seems to require that the destination be a file
        // location, not a directory, so if the given destination is a
        // directory then append the name of the source file but with the
        // extension changed to .pdf
        if (grunt.file.isDir(dest)) {
          var srcFileName = pathlib.basename(src);
          var srcFileExtension = pathlib.extname(src);
          var destFileName = srcFileName.replace(
            new RegExp(srcFileExtension + "$"), // match only the end of the string
            ".pdf"
          );
          dest = pathlib.join(destPath + destFileName);
        }

        grunt.log.writeln(
          "Converting " + src + " -> " + dest
        );

        // default args
        var args = [
          '--dpi', '96',        // workarround to wkhtmltopdf letter-spacing bug (see http://code.google.com/p/wkhtmltopdf/issues/detail?id=72)
          '--print-media-type'  // Use @print media type
        ];

        // overrides the args
        if (file.args) {
          args = file.args;
        }

        // adds the src and dest
        args = args.concat([src, dest]);

        // Launch wkhtmltopdf.
        helper.convert({
          code: 90,
          args: args,
          done: function(err) {
            if (err) {
              grunt.log('>>>', err);
            }
            // if this is the last src of the last file, we are done.
            if((filesIndex+1 >= files.length) && (srcIndex+1 >= file.src.length)) {
              done();
            }
          }
        });
      });
    });
  });
};
