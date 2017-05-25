const winston = require('winston');

module.exports = {
    checkEnvironment: checkEnvironment
}

function checkEnvironment() {
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

    if (hasError) {
        process.exit();
    }

    winston.log('info', 'All required environment values found');
}
