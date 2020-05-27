var gulp = require('gulp'),
    browserSync  = require('browser-sync');


gulp.task('scripts', function() {
    return gulp.src(['app/js/main.js', 'app/libs/**/*.js', "app/js/paper.js", "app/js/myFabric.js"])
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }))
});


gulp.task('browserSync', function () {
    browserSync({
        server:{
            baseDir: 'app'
        },
    });
});

gulp.task('watch', function () {
    gulp.watch('app/*.html', gulp.parallel('code'));
    gulp.watch(['app/js/main.js', 'app/libs/**/*.js', "app/js/paper.js", "app/js/myFabric.js"], gulp.parallel('scripts'));
});

gulp.task('default', gulp.parallel('browserSync', 'watch'));