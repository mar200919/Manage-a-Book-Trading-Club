var gulp = require("gulp");
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var clean = require('gulp-clean');
var sass = require('gulp-sass');

gulp.task('clean-js', function() {
    return gulp.src('public/js/*.js', {read: false})
    .pipe(clean());
});

gulp.task('scripts', ['clean-js'], function() {
    // Grabs the app.js file
    return browserify('./app-client/js/app.js')
        // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.js'))
        // saves it the public/js/ directory
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('sass', function () {
  return gulp.src('app-client/sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./public/css/'));
});


gulp.task('watch', function() {
    gulp.watch('app-client/**/*.js', ['scripts']);
    gulp.watch('app-client/**/*.scss', ['sass']);
});

gulp.task('default', ['watch','sass','scripts']);