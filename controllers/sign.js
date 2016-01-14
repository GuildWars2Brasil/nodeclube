var validator      = require('validator');
var eventproxy     = require('eventproxy');
var config         = require('../config');
var User           = require('../proxy').User;
var mail           = require('../common/mail');
var tools          = require('../common/tools');
var utility        = require('utility');
var authMiddleWare = require('../middlewares/auth');
var uuid           = require('node-uuid');

//sign up
exports.showSignup = function (req, res) {
  res.render('sign/signup');
};

exports.signup = function (req, res, next) {
  var loginname = validator.trim(req.body.loginname).toLowerCase();
  var email     = validator.trim(req.body.email).toLowerCase();
  var pass      = validator.trim(req.body.pass);
  var rePass    = validator.trim(req.body.re_pass);

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('prop_err', function (msg) {
    res.status(422);
    res.render('sign/signup', {error: msg, loginname: loginname, email: email});
  });

  // 验证信息的正确性
  if ([loginname, pass, rePass, email].some(function (item) { return item === ''; })) {
    ep.emit('prop_err', 'Informações incompletas. ');
    return;
  }
  if (loginname.length < 5) {
    ep.emit('prop_err', 'O nome de usuário precisa de pelo menos 5 letras');
    return;
  }
  if (!tools.validateId(loginname)) {
    return ep.emit('prop_err', 'O nome de usuário é inválido');
  }
  if (!validator.isEmail(email)) {
    return ep.emit('prop_err', 'O E-mail é inválido');
  }
  if (pass !== rePass) {
    return ep.emit('prop_err', 'As senhas não correspondem');
  }
  // END 验证信息的正确性


  User.getUsersByQuery({'$or': [
    {'loginname': loginname},
    {'email': email}
  ]}, {}, function (err, users) {
    if (err) {
      return next(err);
    }
    if (users.length > 0) {
      ep.emit('prop_err', 'Email ou nome de usuário em uso');
      return;
    }

    tools.bhash(pass, ep.done(function (passhash) {
      // create gravatar
      var avatarUrl = User.makeGravatar(email);
      User.newAndSave(loginname, loginname, passhash, email, avatarUrl, false, function (err) {
        if (err) {
          return next(err);
        }
        // 发送激活邮件
        mail.sendActiveMail(email, utility.md5(email + passhash + config.session_secret), loginname);
        res.render('sign/signup', {
          success: 'Olá ' + config.name + '！Enviamos uma mensagem para o email cadastro. Por favor ative a sua conta clicando no link dentro deste email.'
        });
      });

    }));
  });
};

/**
 * Show user login page.
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 */
exports.showLogin = function (req, res) {
  req.session._loginReferer = req.headers.referer;
  res.render('sign/signin');
};

/**
 * define some page when login just jump to the home page
 * @type {Array}
 */
var notJump = [
  '/active_account', //active page
  '/reset_pass',     //reset password page, avoid to reset twice
  '/signup',         //regist page
  '/search_pass'    //serch pass page
];

/**
 * Handle user login.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.login = function (req, res, next) {
  var loginname = validator.trim(req.body.name).toLowerCase();
  var pass      = validator.trim(req.body.pass);
  var ep        = new eventproxy();

  ep.fail(next);

  if (!loginname || !pass) {
    res.status(422);
    return res.render('sign/signin', { error: 'Informações incompletas. ' });
  }

  var getUser;
  if (loginname.indexOf('@') !== -1) {
    getUser = User.getUserByMail;
  } else {
    getUser = User.getUserByLoginName;
  }

  ep.on('login_error', function (login_error) {
    res.status(403);
    res.render('sign/signin', { error: 'Nome de usuário ou senha incorretos' });
  });

  getUser(loginname, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return ep.emit('login_error');
    }
    var passhash = user.pass;
    tools.bcompare(pass, passhash, ep.done(function (bool) {
      if (!bool) {
        return ep.emit('login_error');
      }
      if (!user.active) {
        // 重新发送激活邮件
        mail.sendActiveMail(user.email, utility.md5(user.email + passhash + config.session_secret), user.loginname);
        res.status(403);
        return res.render('sign/signin', { error: 'A sua conta não está ativada, um email foi enviado para ' + user.email + ' contendo um link de ativação.' });
      }
      // store session cookie
      authMiddleWare.gen_session(user, res);
      //check at some page just jump to home page
      var refer = req.session._loginReferer || '/';
      for (var i = 0, len = notJump.length; i !== len; ++i) {
        if (refer.indexOf(notJump[i]) >= 0) {
          refer = '/';
          break;
        }
      }
      res.redirect(refer);
    }));
  });
};

// sign out
exports.signout = function (req, res, next) {
  req.session.destroy();
  res.clearCookie(config.auth_cookie_name, { path: '/' });
  res.redirect('/');
};

exports.activeAccount = function (req, res, next) {
  var key  = validator.trim(req.query.key);
  var name = validator.trim(req.query.name);

  User.getUserByLoginName(name, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error('[ACTIVE_ACCOUNT] no such user: ' + name));
    }
    var passhash = user.pass;
    if (!user || utility.md5(user.email + passhash + config.session_secret) !== key) {
      return res.render('notify/notify', {error: 'Informação incorreta, a conta não pode ser ativada'});
    }
    if (user.active) {
      return res.render('notify/notify', {error: 'A conta já está ativa'});
    }
    user.active = true;
    user.save(function (err) {
      if (err) {
        return next(err);
      }
      res.render('notify/notify', {success: 'A conta foi ativada, por favor efetue login'});
    });
  });
};

exports.showSearchPass = function (req, res) {
  res.render('sign/search_pass');
};

exports.updateSearchPass = function (req, res, next) {
  var email = validator.trim(req.body.email).toLowerCase();
  if (!validator.isEmail(email)) {
    return res.render('sign/search_pass', {error: 'Email inválido', email: email});
  }

  // 动态生成retrive_key和timestamp到users collection,之后重置密码进行验证
  var retrieveKey  = uuid.v4();
  var retrieveTime = new Date().getTime();

  User.getUserByMail(email, function (err, user) {
    if (!user) {
      res.render('sign/search_pass', {error: 'Email inexistente', email: email});
      return;
    }
    user.retrieve_key = retrieveKey;
    user.retrieve_time = retrieveTime;
    user.save(function (err) {
      if (err) {
        return next(err);
      }
      // 发送重置密码邮件
      mail.sendResetPassMail(email, retrieveKey, user.loginname);
      res.render('notify/notify', {success: 'Um email lhe foi enviado com instruções para redefinição de senha'});
    });
  });
};

/**
 * reset password
 * 'get' to show the page, 'post' to reset password
 * after reset password, retrieve_key&time will be destroy
 * @param  {http.req}   req
 * @param  {http.res}   res
 * @param  {Function} next
 */
exports.resetPass = function (req, res, next) {
  var key  = validator.trim(req.query.key);
  var name = validator.trim(req.query.name);

  User.getUserByNameAndKey(name, key, function (err, user) {
    if (!user) {
      res.status(403);
      return res.render('notify/notify', {error: 'Informação incorreta, a senha não pode ser redefinida'});
    }
    var now = new Date().getTime();
    var oneDay = 1000 * 60 * 60 * 24;
    if (!user.retrieve_time || now - user.retrieve_time > oneDay) {
      res.status(403);
      return res.render('notify/notify', {error: 'O link expirou, favor solicitar novo email'});
    }
    return res.render('sign/reset', {name: name, key: key});
  });
};

exports.updatePass = function (req, res, next) {
  var psw   = validator.trim(req.body.psw) || '';
  var repsw = validator.trim(req.body.repsw) || '';
  var key   = validator.trim(req.body.key) || '';
  var name  = validator.trim(req.body.name) || '';

  var ep = new eventproxy();
  ep.fail(next);

  if (psw !== repsw) {
    return res.render('sign/reset', {name: name, key: key, error: 'As senhas não conferem'});
  }
  User.getUserByNameAndKey(name, key, ep.done(function (user) {
    if (!user) {
      return res.render('notify/notify', {error: 'Link de ativação inválido'});
    }
    tools.bhash(psw, ep.done(function (passhash) {
      user.pass          = passhash;
      user.retrieve_key  = null;
      user.retrieve_time = null;
      user.active        = true; // 用户激活

      user.save(function (err) {
        if (err) {
          return next(err);
        }
        return res.render('notify/notify', {success: 'A sua senha foi redefinida'});
      });
    }));
  }));
};

