/*!
 * nodeclub - user controller test
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var should = require('should');
var app = require('../../app');
var request = require('supertest')(app);
var mm = require('mm');
var support = require('../support/support');
var _ = require('lodash');
var pedding = require('pedding');
var UserProxy = require('../../proxy/user');
var ReplyModel = require('../../models').Reply;

describe('test/controllers/user.test.js', function () {
  var testUser;
  before(function (done) {
    done = pedding(done, 2);
    support.ready(done);
    support.createUser(function (err, user) {
      testUser = user;
      done(err);
    });
  });

  describe('#index', function () {
    it('should show user index', function (done) {
      request.get('/user/' + testUser.loginname)
      .expect(200, function (err, res) {
        var texts = [
          'Registrado a',
          'Essa pessoa nos deixou no vácuo, não preencheu nenhuma assinatura :(',
          'Últimos tópicos',
          'Nenhum tópico',
          'Últimos posts',
          'Nenhum tópico'
        ];
        texts.forEach(function (text) {
          res.text.should.containEql(text);
        });
        done(err);
      });
    });
  });

  describe('#listStars', function () {
    it('should show star uses', function (done) {
      request.get('/stars')
      .expect(200, function (err, res) {
        res.text.should.containEql('Comunidade Daren');
        done(err);
      });
    });
  });

  describe('#showSetting', function () {
    it('should show setting page', function (done) {
      request.get('/setting')
      .set('Cookie', support.normalUserCookie)
      .expect(200, function (err, res) {
        res.text.should.containEql('Gravatar vinculado');
        res.text.should.containEql('Token de Acesso');
        done(err);
      });
    });

    it('should show success info', function (done) {
      request.get('/setting')
      .query({save: 'success'})
      .set('Cookie', support.normalUserCookie)
      .expect(200, function (err, res) {
        res.text.should.containEql('Salvo com sucesso');
        done(err);
      });
    });
  });

  describe('#setting', function () {
    var userInfo;
    before(function () {
      userInfo = {
        url: 'http://fxck.it',
        location: 'west lake',
        weibo: 'http://weibo.com/tangzhanli',
        github: '@alsotang',
        signature: '仍然很懒',
        name: support.normalUser.loginname,
        email: support.normalUser.email,
      };
    });

    it('should change user setting', function (done) {
      userInfo = _.cloneDeep(userInfo);
      userInfo.action = 'change_setting';
      request.post('/setting')
      .set('Cookie', support.normalUserCookie)
      .send(userInfo)
      .expect(302, function (err, res) {
        res.headers.location.should.equal('/setting?save=success');
        done(err);
      });
    });

    it('should change user password', function (done) {
      userInfo = _.cloneDeep(userInfo);
      userInfo.action = 'change_password';
      userInfo.old_pass = 'pass';
      userInfo.new_pass = 'passwordchanged';
      request.post('/setting')
      .set('Cookie', support.normalUserCookie)
      .send(userInfo)
      .expect(200, function (err, res) {
        res.text.should.containEql('A senha foi modificada com sucesso');
        done(err);
      });
    });

    it('should not change user password when old_pass is wrong', function (done) {
      userInfo = _.cloneDeep(userInfo);
      userInfo.action = 'change_password';
      userInfo.old_pass = 'wrong_old_pass';
      userInfo.new_pass = 'passwordchanged';
      request.post('/setting')
      .set('Cookie', support.normalUserCookie)
      .send(userInfo)
      .expect(200, function (err, res) {
        res.text.should.containEql('A senha atual está incorreta');
        done(err);
      });
    });
  });

  describe('#toggleStar', function () {
    it('should not set star user when no user_id', function (done) {
      request.post('/user/set_star')
      .set('Cookie', support.adminUserCookie)
      .expect(500, function (err, res) {
        res.text.should.containEql('user is not exists');
        done(err);
      });
    });

    it('should set star user', function (done) {
      request.post('/user/set_star')
      .send({
        user_id: support.normalUser._id
      })
      .set('Cookie', support.adminUserCookie)
      .expect(200, function (err, res) {
        res.body.should.eql({status: 'success'});

        UserProxy.getUserById(support.normalUser._id, function (err, user) {
          user.is_star.should.be.true();
          done(err);
        });
      });
    });

    it('should unset star user', function (done) {
      request.post('/user/set_star')
      .send({
        user_id: support.normalUser._id
      })
      .set('Cookie', support.adminUserCookie)
      .expect(200, function (err, res) {
        res.body.should.eql({status: 'success'});

        UserProxy.getUserById(support.normalUser._id, function (err, user) {
          user.is_star.should.be.false();
          done(err);
        });
      });
    });
  });

  describe('#getCollectTopics', function () {
    it('should get /user/:name/collections ok', function (done) {
      request.get('/user/' + support.normalUser.loginname + '/collections')
      .expect(200, function (err, res) {
        res.text.should.containEql('Tópicos favoritos');
        done(err);
      });
    });
  });

  describe('#top100', function () {
    it('should get /users/top100', function (done) {
      request.get('/users/top100')
      .expect(200, function (err, res) {
        res.text.should.containEql('Top100 Score');
        done(err);
      });
    });
  });

  describe('#list_topics', function () {
    it('should get /user/:name/topics ok', function (done) {
      request.get('/user/' + support.normalUser.loginname + '/topics')
      .expect(200, function (err, res) {
        res.text.should.containEql('Criado por');
        done(err);
      });
    });
  });

  describe('#listReplies', function () {
    it('should get /user/:name/replies ok', function (done) {
      request.get('/user/' + support.normalUser.loginname + '/replies')
      .expect(200, function (err, res) {
        res.text.should.containEql(support.normalUser.loginname + ' Participando nos tópicos');
        done(err);
      });
    });
  });

  describe('#block', function () {
    it('should block user', function (done) {
      support.createUser(function (err, newuser) {
        request.post('/user/' + newuser.loginname + '/block')
        .send({
          action: 'set_block'
        })
        .set('Cookie', support.adminUserCookie)
        .expect(200, function (err, res) {
          res.body.should.eql({status: 'success'});
          UserProxy.getUserById(newuser._id, function (err, user) {
            user.is_block.should.be.true();
            done(err);
          });
        });
      });
    });

    it('should unblock user', function (done) {
      request.post('/user/' + support.normalUser.loginname + '/block')
      .send({
        action: 'cancel_block'
      })
      .set('Cookie', support.adminUserCookie)
      .expect(200, function (err, res) {
        res.body.should.eql({status: 'success'});
        done(err);
      })
    })

    it('should wrong when user is not exists', function (done) {
      request.post('/user/not_exists_user/block')
      .send({
        action: 'set_block'
      })
      .set('Cookie', support.adminUserCookie)
      .expect(500, function (err, res) {
        res.text.should.containEql('user is not exists')
        done(err);
      })
    })
  })

  describe('#delete_all', function () {
    it('should delele all ups', function (done) {
      support.createUser(function (err, user) {
        var userId = user._id;
        ReplyModel.findOne(function (err, reply) {
          should.not.exists(err);
          reply.ups.push(userId);
          reply.save(function (err, reply) {
            reply.ups.should.containEql(userId)

            request.post('/user/' + user.loginname + '/delete_all')
              .set('Cookie', support.adminUserCookie)
              .expect(200, function (err, res) {
                res.body.should.eql({ status: 'success' });

                ReplyModel.findOne({_id: reply._id}, function (err, reply) {
                  reply.ups.should.not.containEql(userId)
                  done();
                })
              })
          })
        })
      })
    })
  })
});
