'use strict';

var releaser = require('conventional-github-releaser');

module.exports = [['checkout-master'], function (done) {
    releaser({
        type: "oauth",
        token: '7fda5d0cb00da5dd9a734749cbe3c6a2a58eccc2' // change this to your own GitHub token or use an environment variable
    }, {
        preset: 'angular' // Or to any other commit message convention you use.
    }, done);
}];

