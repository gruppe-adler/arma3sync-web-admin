# arma3sync-web-admin

Web admin tool for [Arma3Sync](https://forums.bohemia.net/forums/topic/152942-arma3sync-launcher-and-addons-synchronization-software-for-arma-3/).

## features

* edit events
* add and remove events

## todo

* generate sync files
* upload mods
* edit repo options
* show more info: mod sizes 

## how to use

* clone
* create `config/production.json`
* `npm i`
* `npm run build`
* `node src/start.js`

^ yes there's some weirdness here in need of improvement

## development notes

This is a [NodeJS](https://nodejs.org/) [Express](https://expressjs.com/) app that is written in [TypeScript](https://www.typescriptlang.org/) (backend) and JavaScript (frontend).

## what it looks like

![shitty table](https://i.imgur.com/9syCA01.png)

![overview](https://i.imgur.com/dxOsx0C.png)
