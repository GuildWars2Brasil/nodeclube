var jsdom = require('mocha-jsdom');
var fs = require('fs');

describe('test/javascripts/video_filter.test.js', function () {
  var $;
  jsdom();

  before(function() {
    $ = require('jquery');
  });

  it('should transform youtube link', function () {
    document.body.innerHTML = '<div class="video_filter"><div class="markdown-text"><p><a href="https://www.youtube.com/watch?v=G7hrh-5T4qM" target="_blank">https://www.youtube.com/watch?v=G7hrh-5T4qM</a></p></div></div>';
    eval(fs.readFileSync('public/javascripts/video_filter.js', 'utf8'));
    $('.video_filter iframe').attr('src').should.equal('http://www.youtube.com/embed/G7hrh-5T4qM');
  });

  it('should transform vimeo link', function () {
    document.body.innerHTML = '<div class="video_filter"><div class="markdown-text"><p><a href="https://vimeo.com/channels/staffpicks/152891209" target="_blank">https://vimeo.com/channels/staffpicks/152891209</a></p></div></div>';
    eval(fs.readFileSync('public/javascripts/video_filter.js', 'utf8'));
    $('.video_filter iframe').attr('src').should.equal('https://player.vimeo.com/video/channels/staffpicks/152891209');
  });

  it('should transform twitch.tv link', function () {
    document.body.innerHTML = '<div class="video_filter"><div class="markdown-text"><p><a href="http://www.twitch.tv/sharishaxd/v/36891558" target="_blank">http://www.twitch.tv/sharishaxd/v/36891558</a></p></div></div>';
    eval(fs.readFileSync('public/javascripts/video_filter.js', 'utf8'));
    $('.video_filter iframe').attr('src').should.equal('http://player.twitch.tv/?video=v36891558');
  });
});
