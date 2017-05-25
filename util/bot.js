const winston = require('winston');
const pfx = process.env.PREFIX;

module.exports = {
    handleMessage: handleMessage,
    login: login,
    printReady: printReady
}

function handleMessage(msg) {
    // Prefix determines if the bot cares about the message
    var prefix = process.env.PREFIX;
    if (!msg.content.startsWith(prefix)) return;

    console.log(msg.content);
}

function login(bot) {
    bot.login(process.env.BOT_KEY);
    winston.log('info', 'Bot connected to discord succesfully');
}

function printReady() {
    winston.log('info', 'LodBot ready')
}
