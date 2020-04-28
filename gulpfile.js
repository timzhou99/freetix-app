var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('watch', function() {
    gulp.watch(['/*.js','**/*.js'], gulp.series('eslint'));
});

gulp.task('eslint', () => {
    return gulp.src(['/*.js','**/*.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format());
});