const winston = require('winston');
const pfx = process.env.PREFIX;
const util = require('./utilities');

module.exports = {
    handleMessage: handleMessage,
    login: login,
    printReady: printReady
}

function handleMessage(msg, plugins) {
    // Prefix determines if the bot cares about the message
    var prefix = process.env.PREFIX;
    if (!msg.content.startsWith(prefix)) return;

    var content = util.parseContent(msg.content);
    winston.log('info', 'Recieved command from \'' + msg.author.username + '\': ' + msg.content);

    for (var key in plugins.plugins) {
        if (!plugins.plugins.hasOwnProperty(key)) continue;

        var plugin = plugins.plugins[key];
        if (plugin.keyword.toUpperCase() == content.keyword.toUpperCase()) {
            plugin.doAction(msg, content.args);
            break;
        }
    }
}

function login(bot) {
    bot.login(process.env.BOT_KEY);
    winston.log('info', 'Bot connected to discord succesfully');
}

function printReady() {
    winston.log('info', 'LodBot ready');
}
