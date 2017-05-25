const winston = require('winston');

module.exports = {
    login: login,
    printReady: printReady
}

function login(bot) {
    bot.login(process.env.BOT_KEY);
    winston.log('info', 'Bot connected to discord succesfully');
}

function printReady() {
    winston.log('info', 'LodBot ready')
}
