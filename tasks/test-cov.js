'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var gutil = require('gulp-util');

module.exports = [['pre-cov'], function (done) {
  process.env.NODE_ENV = 'test';
  var mochaStream = mocha({
    reporter: 'spec',
    require: ['should', './test/env'],
    timeout: 10000
  });
  return gulp.src('test/**/*.test.js', {read: false})
    .pipe(mochaStream)
    .pipe(istanbul.writeReports({
      reporters: ['json', 'text-summary']
    }))
    //.pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
    .on('end', function(){
      process.exit();
    })
    .on('error', function(error){
      if(error.message === 'Coverage failed'){
        gutil.log('ERRO DE COVERAGE, VERIFIQUE SE O COVORAGE É SUPERIOR A 90%');
        gutil.log('Link para análise: file://'+process.cwd()+'/coverage/lcov-report/index.html');
      } else {
        gutil.log('Erro desconhecido: ', error);
      }
    });
}];
