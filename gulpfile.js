const gulp = require('gulp');
const shelljs = require('shelljs');
const path = require('path');
const dist = path.resolve(__dirname, './dist')
gulp.task("copy", () => {
    gulp.src('./assets/style/*.css').pipe(gulp.dest(dist));
    return gulp.src('index.html').pipe(gulp.dest(dist));
});

gulp.task("build", gulp.series((done) => {
    shelljs.exec(`nodemon build/build.js`);
    done()
}));

gulp.task("dev", gulp.series("copy", "build", () => {
    gulp.watch('./resource', gulp.series("build")); // 资源文件的热更新
    gulp.watch('./component', gulp.series("build"));
    gulp.watch('./assets/style', gulp.series("build"));
}));


