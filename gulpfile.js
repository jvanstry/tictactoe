var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var path = require('path');

gulp.task('default', ['browser-sync'], function () {
    gulp.watch(["public/styles.css", "public/game.html"], reload);
    gulp.watch(["public/scripts/*.js"], reload);
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:8080",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 7000,
  });
});

gulp.task('nodemon', function (cb) {
  
  var started = false;
  
  return nodemon({
    script: 'server.js'
  }).on('start', function () {
    if (!started) {
      cb();
      started = true; 
    } 
  });
});