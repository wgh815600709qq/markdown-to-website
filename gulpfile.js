const gulp = require('gulp');
const shelljs = require('shelljs');
const path = require('path');
const dist = path.resolve(__dirname, './dist')
gulp.task("copy", () => {
    gulp.src('./assets/style/*.css').pipe(gulp.dest(dist));
    return gulp.src('./assets/*.html').pipe(gulp.dest(dist));
});

gulp.task("compile", gulp.series((done) => {
    shelljs.exec(`node build/compile.js`)
    done()
}));

gulp.task("build", gulp.series((done) => {
    shelljs.exec(`node build/build.js`)
    done()
}));

gulp.task("dev", gulp.series("copy","compile","build", () => {
    gulp.watch('./resource', gulp.series("compile","build")); // 资源文件的热更新
    gulp.watch('./model', gulp.series("compile","build"));
    gulp.watch('./component', gulp.series("compile","build"));
    gulp.watch('./assets/style', gulp.series("compile","build"));
}));


// model文件的热更新, 不生效
// gulp.task('debugger-build', () => {
//     // nodemon方式
//    shelljs.exec(`node build/build.js --config config/nodemon/build.json`)
// })

