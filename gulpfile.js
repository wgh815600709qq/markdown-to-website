const gulp = require('gulp');
const shelljs = require('shelljs');

gulp.task("compile", gulp.series((done) => {
    shelljs.exec(`node build/compile.js`)
    done()
}));

gulp.task("build", gulp.series((done) => {
    shelljs.exec(`node build/build.js`)
    done()
}));

gulp.task("dev", gulp.series(() => {
    gulp.watch('./resource', gulp.series("compile","build")); // 资源文件的热更新
},"compile","build"));


// model文件的热更新, 不生效
// gulp.task('debugger-build', () => {
//     // nodemon方式
//    shelljs.exec(`node build/build.js --config config/nodemon/build.json`)
// })

