Nodeclub
=

[![build status][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Stories in Ready][waffle-image]][waffle-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]

[travis-image]: https://img.shields.io/travis/GuildWars2Brasil/nodeclube/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/GuildWars2Brasil/nodeclube
[coverage-image]: https://img.shields.io/coveralls/GuildWars2Brasil/nodeclube.svg?style=flat-square
[coverage-url]: https://coveralls.io/github/GuildWars2Brasil/nodeclube?branch=master
[waffle-image]: https://badge.waffle.io/GuildWars2Brasil/nodeclube.png?label=ready&title=Ready
[waffle-url]: https://waffle.io/GuildWars2Brasil/nodeclube
[david-image]: https://img.shields.io/david/GuildWars2Brasil/nodeclube.svg?style=flat-square
[david-url]: https://david-dm.org/GuildWars2Brasil/nodeclube
[node-image]: https://img.shields.io/badge/node.js-%3E=_4.2-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/

## Introdução

O Nodeclub usa o **Node.js** e o **MongoDB** e é um sistema desenvolvido pela comunidade, com uma interface elegante, compacta, rápida e rica em recursos.
Este é um fork do projeto principal [Nodeclub](https://github.com/cnodejs/nodeclub/), da comunidade técnica chinesa do Node.js [CNode(http://cnodejs.org)](http://cnodejs.org), você também pode usá-lo para construir suas próprias comunidades.

## Instalação

*A compatibilidade com o Windows não é garantida*

As dependências são o [io.js](https://iojs.org) v2.3.3, o [MongoDB](https://www.mongodb.org) v2.6 e o [Redis](http://redis.io) v2.8.9.

```
1. Instalação do `Node.js/io.js[必须]` `MongoDB[必须]` `Redis[必须]`
2. Comece com o MongoDB e o Redis
3. `$ make install` Instala as dependências do Nodeclub
4. `cp config.default.js config.js` Modificar de acordo com a necessidade o arquivo de configuração
5. `$ make test` Para garantir que os serviços estão funcionando normalmente
6. `$ node app.js`
7. visite `http://localhost:3000`
8. feito!
```

## Testes

Execução dos testes

```bash
$ make test
```

Execução de testes coverage

```bash
$ make test-cov
```

## Integração Contínua (opcional)
O fórum se integra ao [Openshift](http://openshift.com) para hospedagem e ao [Travis](http://travis-ci.org) para testes e deploy. Para utilizar a integração siga estes passos:

```
1. Executar a instalação local, conforme instruções de [Instalação](#Instalação)
2. Cadastrar o repositório no Travis
3. Encriptar o arquivo de configuração com o comando `travis encrypt-file config.js --add`
4. Modificar arquivo .openshift/pre_start com chaves para descriptografar os dados. Essas chaves estão disponíveis no arquivo .travis.yml na sessão before_install.
5. Criar aplicação no Openshift
6. Adicionar dados da aplicação e do repositório no arquivo .travis.yml, na sessão deploy
7. Efetuar commit das modificações e push do repositório
```

## Contribuição

Tem algum comentário ou sugestão, quer saber o que está sendo planejado? Todos estão convidados a participar no [nosso board](https://waffle.io/GuildWars2Brasil/nodeclube). Você também pode contribuir diretamente ao upstream [Nodeclub](https://github.com/cnodejs/nodeclub/)

## License

MIT
