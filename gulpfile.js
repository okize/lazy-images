var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var eslint = require('gulp-eslint');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var port = 8888;

gulp.task('server', function () {
  connect.server({
    root: ['example'],
    port: port,
    livereload: true
  });
  gutil.log(
    gutil.colors.red('Examples can be viewed at'),
    gutil.colors.blue('http://localhost:' + port)
  );
});

gulp.task('html', function () {
  gulp.src('./example/index.html').pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./example/*', './src/*'], ['html', 'browserify', 'lint']);
});

gulp.task('browserify', function() {
  return browserify('./example/example.js')
    .bundle()
    .pipe(source('scripts.js'))
    .pipe(gulp.dest('./example/'));
});

gulp.task('lint', function () {
  return gulp.src(['lazy-images.js'])
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
