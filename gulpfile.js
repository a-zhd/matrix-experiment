var gulp = require("gulp"),
    reload = require("browser-sync"),
    webserver = require('gulp-server-livereload'),
    webpack = require('webpack'),
    gutil = require('gulp-util'),
    notifier = require('node-notifier'),
    clean = require('gulp-clean');

gulp.task("copy-index-html", function () {
    gulp.src("src/index.html")
        .pipe(gulp.dest("public"))
});

gulp.task("copy-vendors-res", function () {
    gulp.src("res/vendor/**/*")
        .pipe(gulp.dest("public/vendor"))
});

gulp.task("copy-images", function () {
    gulp.src(["res/imgs/**/*"])
        .pipe(gulp.dest("public/images"))
});

gulp.task("copy-resources", ["copy-vendors-res", "copy-vendors-res"]);

gulp.task('clean', function () {
    gulp.src('public', {read: false})
        .pipe(clean());
});

gulp.task("start-webserver-dev", function () {
    gulp.src('public')
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

gulp.task("start-webserver-prod", function () {
    gulp.src('public')
        .pipe(webserver({
            livereload: false,
            open: true
        }));
});

var webpackConfig = require('./webpack.config.js');
var statsLog      = { // для красивых логов в консоли
    colors: true,
    reasons: true
};

gulp.task("build-webpack", (done) => {
    // run webpack
    webpack(webpackConfig, onComplete);

    function onComplete(error, stats) {
        if (error) { // кажется еще не сталкивался с этой ошибкой
            onError(error);
        } else if (stats.hasErrors()) { // ошибки в самой сборке, к примеру "не удалось найти модуль по заданному пути"
            onError(stats.toString(statsLog));
        } else {
            onSuccess(stats.toString(statsLog));
        }
    }

    function onError(error) {
        var formatedError = new gutil.PluginError('webpack', error);

        // notifier.notify({
        //     title: `Error: ${formatedError.plugin}`,
        //     message: formatedError.message
        // });

        done(formatedError);
    }

    function onSuccess(detailInfo) {
        gutil.log('[webpack]', detailInfo);
        done();
    }
});

gulp.task("watcher", () => {
    gulp.watch("./src/**/*.{jsx,js}", ["build-webpack"]);
    gulp.watch("./res/**/*.{css,sass,scss}", ["build-webpack"]);
    gulp.watch("./src/**/*.html", ["copy-index-html"]);
});

gulp.task("dev", ["copy-index-html", "copy-resources", "build-webpack", "watcher", "start-webserver-dev"]);

gulp.task("prod", ["copy-index-html", "copy-resources", "build-webpack", "start-webserver-prod"]);

gulp.task("default", ["prod"]);
