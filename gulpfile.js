/**
 * Created by socio on 12/30/2016.
 */

var gulp = require('gulp');

var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('mApp', function () {
  return gulp.src(['front_app/js/templates/*',
    'front_app/js/models/*',
    'front_app/js/controllers/*',
    'front_app/js/views/*',
    'front_app/js/app.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('public/js'))
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});