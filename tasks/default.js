'use strict';

var nodemon = require('gulp-nodemon');

module.exports = function(done){
  nodemon({
    script: './app.js',
    ext: 'js html',
    env: {
      'NODE_ENV': 'development'
    }
  }).on('quit', done);
};
