var gulp = require("gulp");
var ts = require("gulp-typescript");
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var zip = require("gulp-zip");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", ["clean", "build"], function () {});

gulp.task("minify", ["default"], function() {
    return gulp.src("bin/*.js")    
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("bin/dist"))
});

gulp.task("build", function () {
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest("bin"));
});

gulp.task("rebuild", ["clean", "minify"], function() {});

gulp.task("clean", function() {
    return del([
        "bin/*"
    ]);
});

gulp.task("dist", ["clean", "minify"], function() {
    return gulp.src("bin/**/*.js")
        .pipe(zip("bin/typeQuery.zip"))
        .pipe(gulp.dest("."));
});