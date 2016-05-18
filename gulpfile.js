var gulp = require('gulp');
var gutil = require('gutil');
var rename = require ('gulp-rename');
var jshint = require('gulp-jshint');
var stream = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');

// var taskFolder = function(task) {
// 	return __dirname+"/gulp/tasks/"+task;
// };

// var browserSync = require(taskFolder('browser-sync'));

gulp.task('default', function() {
  // place code for your default task here

});

gulp.task('js', function() {

	gulp.src('./public/javascripts/src/*.js')
		.pipe(jshint({
  		browserify: true
  	}))
  	.pipe(jshint.reporter('jshint-stylish'));

	return browserify('./public/javascripts/src/main.js')
		.bundle()
		.on('error', function(error) {
			gutil.log(error);
		})
		.pipe(stream('bundle.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./public/javascripts'))

});
