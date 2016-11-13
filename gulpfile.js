var jshint = require('gulp-jshint');
var gulp = require('gulp');
var stylish = require('jshint-stylish');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

gulp.task('jshint', function() {
    return gulp.src(['routes/**/*.js', 'models/**/*.js', 'app.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('pre-test', function() {
    return gulp.src(['routes/**/*.js', 'models/**/*.js', 'app.js'])
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function() {
    return gulp.src(['test/*.js'])
        .pipe(mocha())
        // Creating the reports after tests ran
        .pipe(istanbul.writeReports())
        // Enforce a coverage of at least 90%
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});

