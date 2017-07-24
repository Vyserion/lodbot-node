const winston = require('winston');
const database = require('../../util/database');
const helpMessages = require('./helpMessages');

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

    args = args.split(' ');

    switch (args[0]) {
        case HELP_COMMAND:
            helpMessages.printHelpMessage(msg);
            break;
        case NEW_LEADERBOARD_COMMAND:
            addNewLeaderboard(msg, args);
            break;
        case NEW_ROW_COMMAND:
            addNewRow(msg, args);
            break;
        case UPDATE_ROW_COMMAND:
            updateRow(msg, args);
            break;
        default:
            helpMessages.printUnknownCommandMessage(msg);
            break;
    }
}

function addNewLeaderboard(msg, args) {
    // Expected input
    // !leaderboard -a {Leaderboard Name} {Columns}
    if (args.length < 3) {
        winston.log('error', 'Incorrect number of arguments to make leaderboard')
        // TODO: Help message
        return;
    }

    var name = args[1];
    // TODO: Validation on Columns
    var columns = args[2].split(',');
    var leaderboard = {
        columns: columns,
        name: name,
        rows: []
    };

    database.insertToCollection('leaderboards', leaderboard);
}

function addNewRow(msg, args) {
    // Expected input
    // !leaderboard -a {Leaderboard Name} {Row Name}
    if (args.length < 3) {
        winston.log('error', 'Inccorect number of arguments to add row');
        // TODO: Help message
        return;
    }

    var leaderboardName = args[1];
    var collection = database.getCollection('leaderboards', leaderboardName);
    collection.then(function(leaderboards) {
        for (var leaderboardIdx = 0; leaderboardIdx < leaderboards.length; leaderboardIdx++) {
            var leaderboard = leaderboards[leaderboardIdx];

            if (leaderboard.name == leaderboardName) {
                var rowName = args[2];
                var values = {};
                for (var col = 0; col < leaderboard.columns.length; col++) {
                    values[leaderboard.columns[col]] = 0;
                }

                var row = {
                    name: rowName,
                    values: values
                };
                leaderboard.rows.push(row);
                database.updateInCollection('leaderboards', leaderboard);

                return;
            }
        }
    });
}

function updateRow(msg, args) {
    // Expected input
    // !leaderboard -u {leaderboard name} {Row name} {columnname, value}
    if (args.length < 3) {
        winston.log('error', 'Incorrect number of arguments to add row');
        // TODO: Help message
        return;
    }

    var leaderboardName = args[1];
    var collection = database.getCollection('leaderboards', leaderboardName);
    collection.then(function(leaderboards) {
        for (var leaderboardIdx = 0; leaderboardIdx < leaderboards.length; leaderboardIdx++) {
            var leaderboard = leaderboards[leaderboardIdx];

            if (leaderboard.name == leaderboardName) {
                var rowName = args[2];

                for (rowIdx = 0; rowIdx < leaderboard.rows.length; rowIdx++) {
                    if (leaderboard.rows[rowIdx].name == rowName) {
                        var vals = args[3].split(',');
                        var colName = vals[0];
                        var value = vals[1];

                        leaderboard.rows[rowIdx].values[colName] = value;
                        database.updateInCollection('leaderboards', leaderboard);

                        return;
                    }
                }
            }
        }
    });
}

module.exports = {
    keyword: keyword,
    doAction: doAction
}
