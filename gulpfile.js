var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var path = require('path');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('default', ['browserify', 'browser-sync'], function () {
    gulp.watch(["public/styles.css", "public/game.html"], reload);
    gulp.watch(["public/scripts/*.js"], ['browserify', reload]);
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

gulp.task('browserify', function () {
  return browserify('public/scripts/game-controller.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/'));
});

gulp.task('browserify-tests', function(){
  return browserify('jasmine/spec/spec-requirer.js')
    .bundle()
    .pipe(source('bundlespec.js'))
    .pipe(gulp.dest('jasmine/spec/'));
});