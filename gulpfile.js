var gulp = require('gulp'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    gutil = require('gulp-util'),
    sassLint = require('gulp-sass-lint'),
    minifycss = require('gulp-minify-css'),
    util = require('util');

/* Helper functions */
function throwSassError(sassError) {
    throw new gutil.PluginError({
        plugin: 'sass',
        message: util.format(
            "Sass error: '%s' on line %s of %s",
            sassError.message,
            sassError.line,
            sassError.file
        )
    });
}

/* Gulp instructions start here */
gulp.task('help', function() {
    console.log('sass - Generate the min and unminified css from sass');
    console.log('build - Generate css and docs');
    console.log('watch - Watch sass files and generate unminified css');
    console.log('test - Lints Sass');
});

gulp.task('sasslint', function() {
    return gulp.src('scss/**/*.s+(a|c)ss')
      .pipe(sassLint())
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError())
});

var sassImportPaths = ['node_modules'];

gulp.task('sass', function() {
    return gulp.src('scss/**/*.scss')
        .pipe(sass({
            style: 'expanded',
            onError: throwSassError,
            includePaths: sassImportPaths
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulp.dest('build/css/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('build/css/'));
});

gulp.task('build', ['sasslint', 'sass']);

gulp.task('sass-lite', function() {
    return gulp.src('scss/build.scss')
        .pipe(sass({ style: 'expanded', errLogToConsole: true, includePaths: sassImportPaths }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulp.dest('build/css/'));
});

gulp.task('watch', function() {
    gulp.watch('scss/**/*.scss', ['sass-lite']);
});

gulp.task('test', ['sasslint']);

gulp.task('default', ['help']);
