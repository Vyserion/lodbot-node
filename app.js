const Discord = require('discord.js');
const client = new Discord.Client();
const logger = require('./util/logger');

const botFns = require('./util/bot');
const util = require('./util/utilities');
const plugins = require('./util/plugins');

require('dotenv').config();

function start() {
    logger.log('info', 'LodBot starting up');

    // Startup
    util.checkEnvironment();

    // Handlers
    plugins.register();
    client.on('ready', botFns.printReady);
    client.on('message', botFns.handleMessage);
    botFns.login(client);
}

start();
