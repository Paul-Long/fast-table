const gulp = require('gulp');
const less = require('gulp-less');
const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({browsers: ['last 5 versions']});

gulp.task('build-css', function() {
  return gulp
    .src('./theme/table.less')
    .pipe(
      less({
        plugins: [autoprefix]
      })
    )
    .pipe(gulp.dest('./theme/'));
});
