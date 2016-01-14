var should = require('should');
var app = require('../../app');
var request = require('supertest')(app);
var mm = require('mm');
var support = require('../support/support');
var _ = require('lodash');
var pedding = require('pedding');
var multiline = require('multiline');
var MessageService = require('../../common/message');
var eventproxy = require('eventproxy');
var ReplyProxy = require('../../proxy').Reply;

describe('test/common/message.test.js', function () {
  var atUser;
  var author;
  var topic;
  var reply;
  before(function (done) {
    var ep = new eventproxy();

    ep.all('topic', function (_topic) {
      topic = _topic;
      done();
    });
    support.ready(function () {
      atUser = support.normalUser;
      author = atUser;
      reply = {};
      support.createTopic(author._id, ep.done('topic'));
    });
  });

  afterEach(function () {
    mm.restore();
  });

  describe('#sendReplyMessage', function () {
    it('should send reply message', function (done) {
      mm(ReplyProxy, 'getReplyById', function (id, callback) {
        callback(null, {author: {}});
      });
      MessageService.sendReplyMessage(atUser._id, author._id, topic._id, reply._id,
        function (err, msg) {
          request.get('/my/messages')
          .set('Cookie', support.normalUserCookie)
          .expect(200, function (err, res) {
            var texts = [
              author.loginname,
              'respondeu a seu tópico',
              topic.title,
            ];
            texts.forEach(function (text) {
              res.text.should.containEql(text)
            })
            done(err);
          });
        });
    });
  });

  describe('#sendAtMessage', function () {
    it('should send at message', function (done) {
      mm(ReplyProxy, 'getReplyById', function (id, callback) {
        callback(null, {author: {}});
      });
      MessageService.sendAtMessage(atUser._id, author._id, topic._id, reply._id,
        function (err, msg) {
          request.get('/my/messages')
          .set('Cookie', support.normalUserCookie)
          .expect(200, function (err, res) {
            var texts = [
              author.loginname,
              'no tópico',
              topic.title,
              'mencionou você no tópico',
            ];
            texts.forEach(function (text) {
              res.text.should.containEql(text)
            })
            done(err);
          });
        });
    });
  });
})
