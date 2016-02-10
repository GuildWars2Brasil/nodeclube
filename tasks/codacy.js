'use strict';

var gulp = require('gulp');
var codacy = require('gulp-codacy');

module.exports = function (done) {
  return gulp
    .src(['coverage/lcov.info'], {
      read: false
    })
    .pipe(codacy({
      token: process.env.CODACY_PROJECT_TOKEN
    }));
};
