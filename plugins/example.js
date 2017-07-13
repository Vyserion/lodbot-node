const winston = require('winston');

const keyword = 'example';

function doAction(msg, args) {
    /*
        Here we can handle any action that's started with the keyword above.
        Write to a database, return some text, message a user, etc, etc.
    */
}

module.exports = {
    keyword: keyword,
    doAction: doAction
}
