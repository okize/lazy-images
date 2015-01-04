var fs = require('fs');
var spawn = require('child_process').spawn;
var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var eslint = require('gulp-eslint');
var bump = require('gulp-bump');
var browserify = require('browserify');
var buff = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');

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

gulp.task('bump', function() {
  return gulp
    .src('./package.json')
    .pipe(bump({type: 'patch'}))
    .pipe(gulp.dest('./'));
});

gulp.task('version', function(done) {
  return spawn('npm', ['version', getPackageVersion()], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('publish', function(done) {
  return spawn('npm', ['publish'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('npm', ['bump', 'version', 'publish']);
