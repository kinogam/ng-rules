'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['scripts:watch', 'inject'], function () {

/*  gulp.watch([path.join(conf.paths.src, '/!*.html'), 'bower.json'], ['inject']);

  gulp.watch([
    path.join(conf.paths.src, '/app/!**!/!*.css'),
    path.join(conf.paths.src, '/app/!**!/!*.less')
  ], function(event) {
    if(isOnlyChange(event)) {
      gulp.start('styles');
    } else {
      gulp.start('inject');
    }
  });


  gulp.watch(path.join(conf.paths.src, '/app/!**!/!*.html'), function(event) {
    browserSync.reload(event.path);
  });*/
});
