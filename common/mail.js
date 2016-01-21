var mailer        = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config        = require('../config');
var util          = require('util');
var logger = require('./logger');
var transporter     = mailer.createTransport(smtpTransport(config.mail_opts));
var SITE_ROOT_URL = 'http://' + config.host;

/**
 * Send an email
 * @param {Object} data 邮件对象
 */
var sendMail = function (data) {
  if (config.debug) {
    return;
  }
  // 遍历邮件数组，发送每一封邮件，如果有发送失败的，就再压入数组，同时触发mailEvent事件
  transporter.sendMail(data, function (err) {
    if (err) {
      // 写为日志
      logger.error(err);
    }
  });
};
exports.sendMail = sendMail;

/**
 * 发送激活通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
exports.sendActiveMail = function (who, token, name) {
  var from    = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to      = who;
  var subject = config.name + 'Ativação de conta em comunidade';
  var html    = '<p>Olá：' + name + '</p>' +
    '<p>Seja bem vindo a comunidade. Para concluir o seu cadastro, por favor clique no link a seguir：</p>' +
    '<a href  = "' + SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">Link de ativação</a>' +
    '<p>Caso não tenha solicitado nada em nosso site ' + config.name + ', pedimos sinceras desculpas. Porfavor apague essa mensagem.</p>' +
    '<p>Nós, ' + config.name + ', agradecemos a sua atenção.</p>';

  exports.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};

/**
 * 发送密码重置通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
exports.sendResetPassMail = function (who, token, name) {
  var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to = who;
  var subject = config.name + ' - Recuperação de senha';
  var html = '<p>Olá：' + name + '</p>' +
    '<p>Recebemos o seu pedido para redefinir a sua senha, por favor clique no link a seguir no prazo de 24h para redefinir a sua senha：</p>' +
    '<a href="' + SITE_ROOT_URL + '/reset_pass?key=' + token + '&name=' + name + '">Redefinir sua senha</a>' +
    '<p>Caso não tenha solicitado nada em nosso site ' + config.name + ', pedimos sinceras desculpas. Porfavor apague essa mensagem.</p>' +
    '<p>Nós, ' + config.name + ', agradecemos a sua atenção.</p>';

  exports.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};
