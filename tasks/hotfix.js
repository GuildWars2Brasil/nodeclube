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
            gutil.log('HOTFIX RELEASE FINISHED SUCCESSFULLY');
            git.branch(argv.b, {
                args: '-d'
            }, done);
        }
    };

    if (argv.r) {
        runSequence(
            'bump-version',
            'changelog',
            'commit-changes',
            'merge-into-master',
            'merge-into-release',
            'merge-into-develop',
            'push-develop',
            'create-new-tag',
            'github-release',
            check_error
        );
    } else {
        runSequence(
            'bump-version',
            'changelog',
            'commit-changes',
            'merge-into-master',
            'merge-into-develop',
            'push-develop',
            'create-new-tag',
            'github-release',
            check_error
        );
    }

}];
