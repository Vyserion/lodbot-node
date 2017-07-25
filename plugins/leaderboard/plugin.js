const winston = require('winston');
const _ = require('lodash');
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
    // !leaderboard -a {leaderboard name} {columns}

    // TODO: Parameter builders

    if (args.length < 3) {
        winston.log('warn', 'Incorrect number of arguments for new leaderboard, displaying helper message');
        helpMessages.printIncorrectArgumentsMessage(msg);
        return;
    }

    var collection = database.getCollection('leaderboards');
    collection.then(
        function(leaderboards) {
            var leaderboardName = args[1];

            if (args[2].length == 0) {
                winston.log('warn', 'Incorrect arguments for new leaderboard - column values, displaying helper message');
                helpMessages.printIncorrectArgumentsMessage(msg);
                return;
            }

            var columns = args[2].split(',');
            columns = _.uniq(columns);

            for (var leaderboardIdx = 0; leaderboardIdx < leaderboards.length; leaderboardIdx++) {
                if (leaderboards[leaderboardIdx].name == leaderboardName) {
                    winston.log('warn', 'Leaderboard with that name already exists.');
                    helpMessages.printLeaderboardExistsMessage(msg, leaderboardName);
                    return;
                }
            }

            var leaderboard = {
                columns: columns,
                name: leaderboardName,
                rows: []
            };

            winston.log('debug', 'Creating new leaderboard: ' + leaderboard.name);
            database.insertToCollection('leaderboards', leaderboard).then(
                function() {
                    winston.log('debug', 'Leaderboard created successfully');
                    helpMessages.printNewLeaderboardMessage(msg, leaderboard.name);
                }, function(err) {
                    winston.log('error', 'Leaderboard creation failed')
                    helpMessages.printErrorMessage(msg);
                }
            );
        }
    )
}

function addNewRow(msg, args) {
    // !leaderboard -a {leaderboard name} {row name}

    if (args.length < 3) {
        winston.log('error', 'Inccorect number of arguments to add row');
        helpMessages.printIncorrectArgumentsMessage(msg);
        return;
    }

    // TODO: Parameter builders

    var collection = database.getCollection('leaderboards');
    collection.then(
        function(leaderboards) {
            var leaderboardName = args[1];

            var rowNames = args[2];
            rowNames = args[2].split(',');

            var hasRowValues = false;
            var rowsValues;
            if (typeof args[3] != 'undefined') {
                hasRowValues = true;
                rowValues = args[3].split(',');
            }

            for (var leaderboardIdx = 0; leaderboardIdx < leaderboards.length; leaderboardIdx++) {
                var leaderboard = leaderboards[leaderboardIdx];

                if (leaderboard.name == leaderboardName) {
                    for (var rowIdx = 0; rowIdx < rowNames.length; rowIdx++) {
                        var rowName = rowNames[rowIdx];
                        var values = {};

                        if (hasRowValues) {
                            var rowValues = rowValues[rowIdx];
                            rowValues = rowValues.split(';');
                            for (var colIdx = 0; colIdx < rowValues.length; colIdx++) {
                                var vals = rowValues[colIdx].split(':');
                                values[leaderboard.columns[vals[0]]] = vals[1];
                            }
                        } else {
                            for (var col = 0; col < leaderboard.columns.length; col++) {
                                values[leaderboard.columns[col]] = 0;
                            }
                        }

                        var row = {
                            name: rowName,
                            values: values
                        };

                        leaderboard.rows.push(row);
                    }

                    database.updateInCollection('leaderboards', leaderboard);

                    return;
                }
            }

            helpMessages.printLeaderboardNotFoundMessage(msg, leaderboardName);
        }
    );
}

function updateRow(msg, args) {
    // !leaderboard -u {leaderboard name} {row name} {columnname, value}

    if (args.length < 3) {
        winston.log('error', 'Incorrect number of arguments to add row');
        helpMessages.printIncorrectArgumentsMessage(msg);
        return;
    }

    // TODO: Parameter builders

    var collection = database.getCollection('leaderboards');
    collection.then(
        function(leaderboards) {
            var leaderboardName = args[1];

            var rowNames = args[2];
            rowNames = rowNames.split(',');

            for (var leaderboardIdx = 0; leaderboardIdx < leaderboards.length; leaderboardIdx++) {
                var leaderboard = leaderboards[leaderboardIdx];

                if (leaderboard.name == leaderboardName) {
                    for (var rowsIdx = 0; rowsIdx < rowNames.length; rowsIdx++) {
                        var rowName = rowNames[rowIdx];
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
            }

            helpMessages.printLeaderboardNotFoundMessage(msg, leaderboardName);
        }
    );
}

module.exports = {
    keyword: keyword,
    doAction: doAction
}
