'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var webpack = require('webpack-stream');

var $ = require('gulp-load-plugins')();

function webpackWrapper(watch, test, callback) {
    var webpackOptions = {
        watch: watch,
        module: {
            preLoaders: [
                {
                test: /\.js$/,
                exclude: [/node_modules/,/\.spec.js$/],
                loader: 'isparta-instrumenter-loader'
            },
                {test: /\.js$/, exclude: /node_modules/, loader: 'eslint-loader'}
            ],
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    loaders: ['ng-annotate', 'babel-loader']
                }
            ]
        },
        output: {filename: 'ng-rules.js'}
    };

    if (watch || test) {
        webpackOptions.devtool = 'inline-source-map';
    }

    var webpackChangeHandler = function (err, stats) {
        if (err) {
            conf.errorHandler('Webpack')(err);
        }

        $.util.log(stats.toString({
            colors: $.util.colors.supportsColor,
            chunks: false,
            hash: false,
            version: false
        }));


        if (watch) {
            watch = false;
            callback();
        }
    };

    var sources = [path.join(conf.paths.src, '/ng-rules.js')];
    if (test) {
        sources.push(path.join(conf.paths.src, '/**/*.spec.js'));
    }

    return gulp.src(sources)
        .pipe(webpack(webpackOptions, null, webpackChangeHandler))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/')));
}

gulp.task('scripts', function () {
    return webpackWrapper(false, false);
});

gulp.task('scripts:watch', ['scripts'], function (callback) {
    return webpackWrapper(true, false, callback);
});

gulp.task('scripts:test', function () {
    return webpackWrapper(false, true);
});

gulp.task('scripts:test-watch', ['scripts'], function (callback) {
    return webpackWrapper(true, true, callback);
});
