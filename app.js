const Discord = require('discord.js');
const client = new Discord.Client();
const logger = require('./util/logger');

const botFns = require('./util/bot');
const util = require('./util/utilities');
const database = require('./util/database');
const plugins = require('./util/plugins');

require('dotenv').config();

function start() {
    logger.log('info', 'LodBot starting up');

    // Startup
    util.checkEnvironment();
    database.createConnection();

    // Handlers
    plugins.register();
    client.on('ready', botFns.printReady);
    client.on('message', handleMessageWrapper);
    botFns.login(client);
}

function handleMessageWrapper(msg) {
    botFns.handleMessage(msg, plugins);
}

start();
