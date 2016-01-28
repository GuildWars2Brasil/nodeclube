var jsdom = require('mocha-jsdom');
var fs = require('fs');

describe('test/javascripts/twitch.test.js', function () {
  var $;
  jsdom();

  before(function() {
    $ = require('jquery');
    $.getJSON = function(url, callback){
      var data = {streams: [
        {
          channel: {
            logo: 'dumb-logo.jpg',
            display_name: 'dumb-name',
            language: url.indexOf('language') > -1?'pt-br':'en',
            status: 'dumb-title',
            url: 'http://dumb-url.com'
          },
          viewers: 999,
          preview:{medium: 'dumb-preview.jpg'}
        }
      ]};
      callback(data);
    };
  });

  it('should list streams in the right order', function () {
    document.body.innerHTML = '<div id="twitch"></div>';

    eval(fs.readFileSync('public/javascripts/twitch.js', 'utf8'));

    var firstStreamer = $('#twitch .streamer').first();
    var firstDetail = $('#twitch .details').first();
    firstStreamer.find('.flag').attr('class').should.equal('flag pt-br');
    firstStreamer.html().should.containEql('dumb-logo.jpg');
    firstStreamer.html().should.containEql('dumb-name');
    firstDetail.html().should.containEql('dumb-title');
    firstDetail.html().should.containEql('http://dumb-url.com');

    var lastStreamer = $('#twitch .streamer').last();
    var lastDetail = $('#twitch .details').last();
    lastStreamer.find('.flag').attr('class').should.equal('flag en');
    lastStreamer.html().should.containEql('dumb-logo.jpg');
    lastStreamer.html().should.containEql('dumb-name');
    lastDetail.html().should.containEql('dumb-title');
    lastDetail.html().should.containEql('http://dumb-url.com');
  });
});
