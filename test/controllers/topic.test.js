
var should = require('should');
var app = require('../../app');
var request = require('supertest')(app);
var support = require('../support/support');
var mm = require('mm');
var store = require('../../common/store');
var pedding = require('pedding');

describe('test/controllers/topic.test.js', function () {

  before(function (done) {
    support.ready(done);
  });

  afterEach(function () {
    mm.restore();
  });

  describe('#index', function () {
    it('should get /topic/:tid 200', function (done) {
      request.get('/topic/' + support.testTopic._id)
      .expect(200, function (err, res) {
        res.text.should.containEql('test topic content');
        res.text.should.containEql('alsotang');
        done(err);
      });
    });

    it('should get /topic/:tid 200 when login in', function (done) {
      request.get('/topic/' + support.testTopic._id)
      .set('Cookie', support.normalUser2Cookie)
      .expect(200, function (err, res) {
        res.text.should.containEql('test topic content');
        res.text.should.containEql('alsotang');
        done(err);
      });
    });
  });

  describe('#create', function () {
    it('should show a create page', function (done) {
      request.get('/topic/create')
        .set('Cookie', support.normalUserCookie)
        .expect(200, function (err, res) {
          res.text.should.containEql('Postar tópico');
          done(err);
        });
    });
  });

  describe('#put', function () {
    it('should not create a topic when no title', function (done) {
      request.post('/topic/create')
      .send({
        title: '',
        tab: 'geral',
        t_content: '木耳敲回车',
      })
      .set('Cookie', support.normalUserCookie)
      .expect(422, function (err, res) {
        res.text.should.containEql('O título não pode estar vazio');
        done(err);
      });
    });

    it('should not create a topic when no tab', function (done) {
      request.post('/topic/create')
      .send({
        title: '呵呵复呵呵',
        tab: '',
        t_content: '木耳敲回车',
      })
      .set('Cookie', support.normalUserCookie)
      .expect(422, function (err, res) {
        res.text.should.containEql('Você deve selecionar uma aba');
        done(err);
      });
    });

    it('should not create a topic when no content', function (done) {
      request.post('/topic/create')
      .send({
        title: '呵呵复呵呵',
        tab: 'geral',
        t_content: '',
      })
      .set('Cookie', support.normalUserCookie)
      .expect(422, function (err, res) {
        res.text.should.containEql('O conteúdo do post não pode ser vazio');
        done(err);
      });
    });

    it('should create a topic', function (done) {
      request.post('/topic/create')
      .send({
        title: '呵呵复呵呵' + new Date(),
        tab: 'geral',
        t_content: '木耳敲回车',
      })
      .set('Cookie', support.normalUserCookie)
      .expect(302, function (err, res) {
        res.headers.location.should.match(/^\/topic\/\w+$/);
        done(err);
      });
    });
  });

  describe('#showEdit', function () {
    it('should show a edit page', function (done) {
      request.get('/topic/' + support.testTopic._id + '/edit')
      .set('Cookie', support.normalUserCookie)
      .expect(200, function (err, res) {
        res.text.should.containEql('Editar tópico');
        done(err);
      });
    });
  });

  describe('#update', function () {
    it('should update a topic', function (done) {
      request.post('/topic/' + support.testTopic._id + '/edit')
      .send({
        title: '修改后的 topic title',
        tab: 'geral',
        t_content: '修改后的木耳敲回车',
      })
      .set('Cookie', support.normalUserCookie)
      .expect(302, function (err, res) {
        res.headers.location.should.match(/^\/topic\/\w+$/);
        done(err);
      });
    });
  });

  describe('#delete', function () {
    var wouldBeDeleteTopic;
    before(function (done) {
      support.createTopic(support.normalUser._id, function (err, topic) {
        wouldBeDeleteTopic = topic;
        done(err);
      });
    });

    it('should not delete a topic when not author', function (done) {
      request.post('/topic/' + wouldBeDeleteTopic._id + '/delete')
      .set('Cookie', support.normalUser2Cookie)
      .expect(403, function (err, res) {
        res.body.should.eql({success: false, message: 'Sem permissão'});
        done(err);
      });
    });

    it('should delele a topic', function (done) {
      request.post('/topic/' + wouldBeDeleteTopic._id + '/delete')
      .set('Cookie', support.normalUserCookie)
      .expect(200, function (err, res) {
        res.body.should.eql({ success: true, message: 'O tópico foi excluído' });
        done(err);
      });
    });
  });

  describe('#top', function () {
    it('should top a topic', function (done) {
      request.post('/topic/' + support.testTopic._id + '/top')
      .set('Cookie', support.adminUserCookie)
      .expect(200, function (err, res) {
        res.text.should.containEql('TOP marcado no tópico');
        done(err);
      });
    });

    it('should untop a topic', function (done) {
      request.post('/topic/' + support.testTopic._id + '/top')
      .set('Cookie', support.adminUserCookie)
      .expect(200, function (err, res) {
        res.text.should.containEql('TOP removido do tópico');
        done(err);
      });
    });
  });

  describe('#good', function () {
    it('should good a topic', function (done) {
      request.post('/topic/' + support.testTopic._id + '/good')
      .set('Cookie', support.adminUserCookie)
      .expect(200, function (err, res) {
        res.text.should.containEql('LIKE marcado no tópico');
        done(err);
      });
    });

    it('should ungood a topic', function (done) {
      request.post('/topic/' + support.testTopic._id + '/good')
      .set('Cookie', support.adminUserCookie)
      .expect(200, function (err, res) {
        res.text.should.containEql('LIKE removido do tópico');
        done(err);
      });
    });
  });

  describe('#collect', function () {
    it('should collect a topic', function (done) {
      request.post('/topic/collect')
      .send({
        topic_id: support.testTopic._id,
      })
      .set('Cookie', support.normalUser2Cookie)
      .expect(200, function (err, res) {
        res.body.should.eql({status: 'success'});
        done(err);
      })
    })
  })

  describe('#de_collect', function () {
    it('should decollect a topic', function (done) {
      request.post('/topic/de_collect')
      .send({
        topic_id: support.testTopic._id,
      })
      .set('Cookie', support.normalUser2Cookie)
      .expect(200, function (err, res) {
        res.body.should.eql({status: 'success'});
        done(err);
      });
    });
  });

  describe('#upload', function () {
    it('should upload a file', function (done) {

      mm(store, 'upload', function (file, options, callback) {
        callback(null, {
          url: 'upload_success_url'
        });
      });
      request.post('/upload')
      .attach('selffile', __filename)
      .set('Cookie', support.normalUser2Cookie)
      .end(function (err, res) {
        res.body.should.eql({"success": true, "url": "upload_success_url"});
        done(err);
      });
    });
  });

  describe('#lock', function () {
    it('should lock a topic', function (done) {
      request.post('/topic/' + support.testTopic._id + '/lock')
      .set('Cookie', support.adminUserCookie)
      .expect(200, function (err, res) {
        res.text.should.containEql('Tópico trancado');
        done(err);
      });
    });

    it('should not reply a locked topic', function (done) {
      var topic = support.testTopic;
      request.post('/' + topic._id + '/reply')
      .set('Cookie', support.normalUserCookie)
      .send({
        r_content: 'test reply 1'
      })
      .expect(403)
      .end(function (err, res) {
        res.text.should.equal('Este tópico foi trancado');
        done(err);
      });
    });

    it('should unlock a topic', function (done) {
      request.post('/topic/' + support.testTopic._id + '/lock')
      .set('Cookie', support.adminUserCookie)
      .expect(200, function (err, res) {
        res.text.should.containEql('Tópico liberado');
        done(err);
      });
    });

    it('should reply a unlocked topic', function (done) {
      var topic = support.testTopic;
      request.post('/' + topic._id + '/reply')
      .set('Cookie', support.normalUserCookie)
      .send({
        r_content: 'test reply 1'
      })
      .expect(302)
      .end(function (err, res) {
        done(err);
      });
    });
  });
});
