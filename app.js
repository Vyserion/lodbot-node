const Discord = require('discord.js');
const client = new Discord.Client();
const logger = require('./util/logger');

const botFns = require('./util/bot');
const util = require('./util/utilities');

require('dotenv').config();

function start() {
    logger.log('info', 'LodBot starting up');

    // Startup
    util.checkEnvironment();

    // Handlers
    client.on('ready', botFns.printReady);
    botFns.login(client);
}

start();
