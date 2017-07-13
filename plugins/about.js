const winston = require('winston');
const pjson = require('../package.json');

const keyword = 'about';

function doAction(msg) {
    var response = 'Hi! I\'m LodBot! \n';
    response += 'Author: ' + pjson.author + ' \n';
    response += 'Version: ' + pjson.version + '\n\n';
    response += 'Website: ' + pjson.homepage;

    msg.reply(response);
}

module.exports = {
    keyword: keyword,
    doAction: doAction
}
