var jsdom = require('mocha-jsdom');
var fs = require('fs');
var mockRequest = require('xhr-mock');

describe('test/javascripts/twitch.test.js', function () {
  var $;
  jsdom();

  before(function () {
    $ = require('jquery');
    mockRequest.setup();

    var sendData = function (req, res) {
      var data = {
        streams: [{
          channel: {
            logo: 'dumb-logo.jpg',
            display_name: 'dumb-name',
            language: req._url.indexOf('language') > -1 ? 'pt' : 'en',
            status: 'dumb-title',
            url: 'http://dumb-url.com'
          },
          viewers: 999,
          preview: {
            medium: 'dumb-preview.jpg'
          }
      }]
      };

      res.status(201);
      res.body(JSON.stringify(data));
      return res;
    };

    mockRequest.get("https://api.twitch.tv/kraken/streams?game=Guild+Wars+2&language=pt&limit=5", sendData);
    mockRequest.get("https://api.twitch.tv/kraken/streams?game=Guild+Wars+2&language=en&limit=5", sendData);

  });

  it('should list streams in the right order', function (done) {
    var twitch = document.createElement("div");
    twitch.id = "twitch";
    document.body.appendChild(twitch);

    var elements = [];
    var finish = function(element) {
      elements.push(element);
      if(elements.length >= 2) {
        done();
      } else {
        Error('Missing elements');
      }
    };

    window.document.addEventListener('DOMNodeInserted', function(event){
      var element = event.target;
      if(element.className === ' details') {
        $(element).html().should.containEql('dumb-title');
        $(element).html().should.containEql('http://dumb-url.com');
        finish(element);
      } else if(element.className === ' streamer') {
        $(element).find('.flag').attr('class').should.equal('flag pt');
        $(element).html().should.containEql('dumb-logo.jpg');
        $(element).html().should.containEql('dumb-name');
        finish(element);
      }
    }, false);

    eval(fs.readFileSync('public/libs/docready.js', 'utf8'));
    eval(fs.readFileSync('public/libs/classlist.js', 'utf8'));
    eval(fs.readFileSync('public/javascripts/twitch.js', 'utf8'));
  });

  after(function () {
    mockRequest.teardown();
  });
});
