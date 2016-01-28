'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var argv = require('yargs').argv;

module.exports = [['install', 'pre-test'], function (done) {
  process.env.NODE_ENV = 'test';
  var mochaStream = mocha({
    reporter: 'spec',
    require: ['should', './test/env'],
    timeout: 10000
  });
  gulp.src(argv.t || 'test/**/*.test.js', {read: false})
    .pipe(mochaStream)
    .once('end', done);
}];
