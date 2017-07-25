const helpMessages = require('./helpMessages');
const leaderboards = require('./leaderboards');
const rows = require('./rows');

const keyword = 'leaderboard';

const HELP_COMMAND = '-h';
const NEW_LEADERBOARD_COMMAND = '-n';
const NEW_ROW_COMMAND = '-a';
const UPDATE_ROW_COMMAND = '-u';

function doAction(msg, args) {
    if (args.length == 1) {
        winston.log('warn', 'No arguments detected from user input, displaying helper message.');
        helpMessages.printNoArgumentsMessage();
        return;
    }

    // TODO: Move all log messages to single file

    args = args.split(' ');

    switch (args[0]) {
        case HELP_COMMAND:
            helpMessages.printHelpMessage(msg);
            break;
        case NEW_LEADERBOARD_COMMAND:
            leaderboards.createLeaderboard(msg, args);
            break;
        case NEW_ROW_COMMAND:
            rows.createRow(msg, args);
            break;
        case UPDATE_ROW_COMMAND:
            rows.updateRow(msg, args);
            break;
        default:
            helpMessages.printUnknownCommandMessage(msg);
            break;
    }
}

module.exports = {
    keyword: keyword,
    doAction: doAction
}
