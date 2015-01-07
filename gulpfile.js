var fs = require('fs');
var spawn = require('child_process').spawn;
var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var eslint = require('gulp-eslint');
var browserify = require('browserify');
var buff = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var semver = require('semver');

var getPackageVersion = function() {
  json = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  return json.version
}

var port = 8888;
var bundler = browserify({
      entries: ['./example/example.js'],
      debug: true
    });

gulp.task('server', function () {
  connect.server({
    root: ['example'],
    port: port,
    livereload: true
  });
  return gutil.log(
    gutil.colors.red('Examples can be viewed at'),
    gutil.colors.blue('http://localhost:' + port)
  );
});

gulp.task('html', function () {
  return gulp
    .src('./example/index.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  return gulp
    .watch(['lazy-images.js', './example/*'], ['html', 'browserify', 'lint']);
});

gulp.task('browserify', function() {
  return bundler
    .bundle()
    .pipe(source('scripts.js'))
    .pipe(buff())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./example/'));
});

gulp.task('lint', function () {
  return gulp
    .src(['lazy-images.js'])
    .pipe(eslint({
      rules: {
        'quotes': true,
      },
      globals: {
        'exports': true,
        'module': true
      },
      envs: [
        'browser'
      ]
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('default', ['browserify', 'server', 'watch']);

gulp.task('version', function() {
  var newVersion = semver.inc(getPackageVersion(), 'patch');
  return spawn('npm', ['version', newVersion], {stdio: 'inherit'});
});

gulp.task('publish', function() {
  return spawn('npm', ['publish'], {stdio: 'inherit'});
});

gulp.task('npm', function(callback) {
  runSequence('version', 'publish', callback);
});
