var gulp    = require('gulp');
var gutil   = require('gulp-util');
var uglify  = require('gulp-uglify');
var concat  = require('gulp-concat');

//- 通过 require() 载入我们需要用到的插件~ 

gulp.task('concat', function () {
    gulp.src('./script/*.js')
        .pipe(uglify())
        
        .pipe(gulp.dest('./build/js'));
});

gulp.task('default', ['concat']);