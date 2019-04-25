const gulp = require('gulp');
const less = require('gulp-less');
const autoprefix = require('less-plugin-autoprefix')({
  browsers: ['last 5 versions'],
  cascade: true
});

gulp.task('build-css', function() {
  return gulp
    .src('./theme/table.less')
    .pipe(
      less({
        plugins: [
          require('autoprefixer')({
            browsers: ['>0%']
          }),
          require('cssnano')
        ]
      })
    )
    .pipe(gulp.dest('./theme/'));
});
