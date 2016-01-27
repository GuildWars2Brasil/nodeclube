'use strict';

var argv = require('yargs').argv;
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var git = require('gulp-git');

module.exports = [['test'], function (done) {
    if (!argv.b) {
        throw new Error('Branch não informado, informe-o usando o argumento -b');
    }

    var check_error = function (error) {
        if (error) {
            throw error;
        } else {
            gutil.log('FEATURE MERGED SUCCESSFULLY');
            git.branch(argv.b, {
                args: '-d'
            }, done);
        }
    };
    runSequence(
        'merge-into-develop',
        check_error
    );
}];
