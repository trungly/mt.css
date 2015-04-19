var gulp         = require('gulp');
var args         = require('yargs').argv;
var connect      = require('gulp-connect');
var gulpif       = require('gulp-if');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');
var sequence     = require('run-sequence');
var debug        = require('gulp-debug');

var PATHS = {
    dev_sass:   './_dev/sass/',
    prod_css:   './css/'
};

// prod env toggle check
var isProd = args.type === 'prod'

// task: simple local server task
gulp.task('server', function() {
  connect.server({
    livereload: true
  });
});

// task: index.html refresh
gulp.task('reload', function() {
  return gulp.src( 'index.html' )
    .pipe( connect.reload() );
});

// task: compile sass
gulp.task( 'sass', function() {
    var stream,
        config = {};

    if ( isProd ) { config.outputStyle = 'compressed'; }

    stream = gulp.src( PATHS.dev_sass + 'mt.scss' )
        .pipe( plumber() )
        .pipe( sass( config ) )
        .pipe( autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe( gulp.dest( PATHS.prod_css ) )
        .pipe( connect.reload() );
});

// task: automatic file change watchers
gulp.task( 'watch', function() {
    gulp.watch( PATHS.dev_sass   + '**/*.scss',   ['sass'] );
    gulp.watch( '**/*.html',                      ['reload'] );
});

// task: 'default' ( just run "gulp" or "gulp --type prod")
gulp.task( 'default', function() {
    sequence( 'server', 'sass', 'watch' );
});
