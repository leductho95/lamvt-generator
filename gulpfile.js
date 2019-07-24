"use strict";

var gulp = require("gulp"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  scsslint = require('gulp-scss-lint'),
  cache = require('gulp-cached'),
  maps = require("gulp-sourcemaps"),
  runSequence = require("run-sequence"),
  pug = require("gulp-pug"),
  plumber = require('gulp-plumber'),
  del = require("del"),
  autoprefixer = require("gulp-autoprefixer"),
  browserSync = require("browser-sync").create();
  // htmlreplace = require("gulp-html-replace"),
  // cssmin = require("gulp-cssmin");

gulp.task("concatScripts", function () {
  return gulp
    .src([
      "source/js/vendor/jquery-3.3.1.slim.min.js",
      "source/js/vendor/popper.min.js",
      "source/js/vendor/bootstrap.min.js",
      "source/js/vendor/owl.carousel.min.js",
      "source/js/vendor/wow.min.js",
      "source/js/functions.js",
    ])
    .pipe(maps.init())
    .pipe(concat("main.js"))
    .pipe(maps.write("./"))
    .pipe(gulp.dest("source/js"))
    .pipe(browserSync.stream());
});

gulp.task("compilePug", function () {
  return gulp
    .src("source/*.pug")
    .pipe(plumber(function (error) {
      console.log('Task compilePug has error', error.message);
      this.emit('end');
    }))
    .pipe(
      pug({
        doctype: "html",
        pretty: true,
        cache: true
      })
    )
    .pipe(plumber.stop())
    .pipe(gulp.dest("./source"));
});

gulp.task("minifyScripts", ["concatScripts"], function () {
  return gulp
    .src("source/js/main.js")
    // .pipe(uglify())
    // .pipe(rename("main.min.js"))
    .pipe(gulp.dest("dist/js"));
});

gulp.task('scss-lint', function () {
  return gulp.src([
      'source/css/*.scss',
      'source/css/layout/*.scss',
    ])
    .pipe(cache('scsslint'))
    .pipe(scsslint({
      'maxBuffer': 99999,
      'config': 'scss-lint.yml'
    }));
});

gulp.task("compileSCSS", ["scss-lint"], function () {
  return gulp
    .src("source/css/main.scss")
    .pipe(maps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(maps.write("./"))
    .pipe(gulp.dest("source/css"))
    .pipe(browserSync.stream());
});

gulp.task("copyCss", function () {
  return gulp
    .src("source/css/main.css")
    // .pipe(cssmin())
    // .pipe(rename("main.min.css"))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("watchFiles", function () {
  gulp.watch("source/css/**/*.scss", ["compileSCSS"]);
  gulp.watch("source/js/*.js", ["concatScripts"]);
  gulp.watch(["source/*.pug", "source/layouts/*.pug"], ["compilePug"]);
});

gulp.task("clean", function () {
  del(["dist", "source/css/main.css*", "!source/images/placeholder.png","source/images/*", "source/*html", "node_modules"]);
});

gulp.task("copyFavicon", function () {
  return gulp.src(["source/favicon.png", "source/favicon.ico"]).pipe(gulp.dest("dist"));
});

gulp.task("copyImages", ['copyFavicon'], function () {
  return gulp.src("source/images/*.*").pipe(gulp.dest("dist/images"));
});

gulp.task("copyFonts", function () {
  return gulp.src("source/fonts/*.*").pipe(gulp.dest("dist/fonts"));
});

gulp.task("copyHTML", function () {
  return gulp.src("source/*.html").pipe(gulp.dest("dist/"));
});

// gulp.task("renameSource", function () {
//   return gulp
//     .src(["source/*.html", "source/*.php", "!dist", "!dist/**"])
//     .pipe(
//       htmlreplace({
//         js: "js/main.min.js",
//         css: "css/main.min.css"
//       })
//     )
//     .pipe(gulp.dest("dist/"));
// });

gulp.task("build", function () {
  runSequence(
    "copyHTML",
    "copyCss",
    "minifyScripts",
    "copyImages",
    "copyFonts",
    // "renameSource"
  );
  return gulp
    .src(["*.html", "*.php", "favicon.ico"], {
      base: "./"
    })
    .pipe(gulp.dest("dist"));
});

gulp.task('browser-sync', function() {
  return browserSync.init(options.browserSync);
});

gulp.task("dev", ['compileSCSS', 'compilePug', "watchFiles"], function () {
  browserSync.init({
    port: 1995,
    server: {
      baseDir: 'source/',
      index: 'index.html'
    }
  });

  gulp.watch("source/css/**/*.scss", ["watchFiles"]);
  gulp.watch(["source/*.html", "source/*.php"]).on("change", browserSync.reload);
});

gulp.task("default", ["clean", "build"], function () {
  gulp.start("renameSources");
});