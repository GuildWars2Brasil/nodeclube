'use strict';

var git = require('gulp-git');
var argv = require('yargs').argv;
var version = require('./package-version.js');

module.exports = function (done) {
    if (!argv.r) {
        throw new Error('Branch de release não informado, informe-o usando o argumento -r');
    }

    git.checkout('release-' + version(), function () {
        git.merge(argv.r, {
            args: '--no-ff'
        }, done);
    });
};
