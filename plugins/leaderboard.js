const winston = require('winston');
const database = require('../util/database');

const keyword = 'leaderboard';

const HELP_COMMAND = '-h';
const NEW_LEADERBOARD_COMMAND = '-n';
const NEW_ROW_COMMAND = '-a';
const UPDATE_ROW_COMMAND = '-u';

function doAction(msg, args) {
    if (args.length == 1) {
        winston.log('warn', 'No arguments detected from user input, displaying helper message.');
        printNoArgumentsMessage();
        return;
    }

    args = args.split(' ');

    switch (args[0]) {
        case HELP_COMMAND:
            printHelpMessage(msg);
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
            printUnknownCommandMessage(msg);
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

function printNoArgumentsMessage(msg) {
    var response  = 'You didn\t submit any commands! Please check the help command (!leaderboard -h) to get help';
    msg.reply(response);
}

function printHelpMessage(msg) {
    var response = 'The leaderboard plugin can accept the following commands: \n';
    // Help command
    response += '**Help** \n';
    response += '-h \n';
    response += 'Prints this help message. \n\n';
    // New Leaderboard
    response += '**New Leaderboard** \n';
    response += '-n \n';
    response += 'Creates a new leaderboard. It requires the following information: \n';
    response += '    - *Leaderboard Name* - The name of the new leaderboard. \n';
    response += '    - *Columns* - The list of columns in the leaderboard. For multiple columns, seperate with commas. \n';
    response += 'For example: \n';
    response += '    !leaderboard -n {Leaderboard Name} {Columns} \n';
    response += '    !leaderboard -n NewLeaderboardName Column1,Column2 \n\n';
    // New Row
    response += '**New Row** \n';
    response += '-a \n';
    response += 'Creates a new row inside a leaderboard. It requires the following information: \n';
    response += '    - *Leaderboard Name* - The name of the leaderboard to add to. \n';
    response += '    - *Row Name* - The name of the row to add. \n';
    response += 'For example: \n';
    response += '    !leaderboard -a {Leaderboard Name} {Row Name} \n';
    response += '    !leaderboard -a LeaderboardName NewRowName \n\n';
    // Update Row
    response += '**Update Row** \n';
    response += '-u \n';
    response += 'Updates a row to the given values. It requires the following information: \n';
    response += '    - *Leaderboard Name* - The name of the leaderboard to update. \n';
    response += '    - *Row Name* - The name of the row to update \n';
    response += '    - *Values* - The values to update. This is in the format ColumnName,Value \n';
    response += 'For example: \n';
    response += '    !leaderboard -u {Leaderboard Name} {Row Name} {Values} \n';
    response += '    !leaderboard -u LeaderboardName RowName ColumnOne:1';

    msg.reply(response);
}

function printUnknownCommandMessage(msg) {
    var response = 'That command wans\'t recognised. Please check the help message for what commands are available.';
    msg.reply(response);
}

module.exports = {
    keyword: keyword,
    doAction: doAction
}
