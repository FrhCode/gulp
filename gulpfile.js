"use strict";

const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
var browsersync = require("browser-sync").create();

const postCss = require("gulp-postcss");
const autoPrefixer = require("autoprefixer");
const cssNano = require("cssnano");

const path = {
    htmlSrc: "./src/**/*.html",
    htmlDest: "./public/",

    staticSrc: "./src/static/**/*.*",
    staticdest: "./public/static/",

    scssSrc: "./src/scss/main.scss",
    scssDest: "./public/css/",

    jsSrc: "./src/js/**/*js",
    jsDest: "./public/js/",

    htmlWatchLocation: "./src/**/*.html",
    scssWatchLocation: "./src/scss/**/*.scss",
    jsWatchLocation: "./src/js/**/*.js",
}

function copyHTML() {
    const { htmlSrc, htmlDest } = path;

    return src(htmlSrc)
        .pipe(dest(htmlDest));
}

function copyStaticFile() {
    const { staticSrc, staticdest } = path;

    return src(staticSrc)
        .pipe(dest(staticdest));
}

function buildStyle() {
    const plugins = [
        autoPrefixer(),
        cssNano()
    ];

    const { scssSrc, scssDest } = path;

    return src(scssSrc)
        .pipe(sass())
        .pipe(postCss(plugins))
        .pipe(dest(scssDest))
        .pipe(browsersync.stream());
}

function buildJs() {
    const { jsSrc, jsDest } = path;

    return src(jsSrc)
        .pipe(dest(jsDest));
}

function browserSyncConfig() {

    browsersync.init({
        port: 8080,
        server: {
            baseDir: "./public",
        },
    });
}

function watchChange() {
    const { htmlWatchLocation, scssWatchLocation, jsWatchLocation } = path;

    watch(htmlWatchLocation).on("change", series(copyHTML, browsersync.reload));
    watch(scssWatchLocation, buildStyle);
    watch(jsWatchLocation).on("change", series(buildJs, browsersync.reload));
}

exports.default =
    series(
        copyHTML,
        copyStaticFile,
        buildStyle,
        buildJs,
        parallel(watchChange, browserSyncConfig)
    );
