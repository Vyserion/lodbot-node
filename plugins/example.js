const winston = require('winston');

module.exports = {
    keyword: keyword,
    doAction: doAction
}

const keyword = 'example';

function doAction() {
    /*
        Here we can handle any action that's started with the keyword above.
        Write to a database, return some text, message a user, etc, etc.
    */
}
