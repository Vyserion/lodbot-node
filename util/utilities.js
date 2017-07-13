const winston = require('winston');

module.exports = {
    checkEnvironment: checkEnvironment,
    parseContent: parseContent
}

function checkEnvironment(msg, args) {
    var hasError = false;

    // Logging level
    if (typeof process.env.LOG_LEVEL == 'undefined' || process.env.LOG_LEVEL.length == 0) {
        winston.log('warn', 'No log level defined in environment file');
    } else {
        winston.level = process.env.LOG_LEVEL;
    }

    // Discord bot key#
    if (typeof process.env.BOT_KEY == 'undefined' || process.env.BOT_KEY.length == 0) {
        winston.log('error', 'No discord client key defined in environment file');
        hasError = true;
    }

    // MongoDB URL
    if (typeof process.env.MONGO_URL == 'undefined' || process.env.MONGO_URL.length == 0) {
        winston.log('error', 'No MongoDB URL provided in environment file');
        hasError = true;
    }

    // Command prefix
    if (typeof process.env.PREFIX == 'undefined' || process.env.PREFIX.length == 0) {
        winston.log('error', 'No Prefix provided in environment file');
        hasError = true;
    }

    // Plugins prefix
    if (typeof process.env.PLUGINS == 'undefined' || process.env.PLUGINS.length == 0) {
        winston.log('warn', 'No plugins configured in environment file');
    }

    if (hasError) {
        process.exit();
    }

    winston.log('info', 'All required environment values found');
}

function parseContent(content) {
    // Splits out a content string into it's keyword and arguments.

    // Remove the prefix
    content = content.substring(1);

    // Filter the rest of the content
    var contentObj = {};
    if (content.indexOf(' ') > -1) {
        contentObj['keyword'] = content.substring(0, content.indexOf(" "));
        contentObj['args'] = content.substring(content.indexOf(" "), content.length);
    } else {
        contentObj['keyword'] = content;
        contentObj['args'] = '';
    }

    return contentObj;
}
