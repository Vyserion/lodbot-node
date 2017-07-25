const database = require('../../util/database');
const helpMessages = require('./helpMessages');

const winston = require('winston');

/**
* Creates a new rows inside a leaderboard.
* Accepts a command of the following format:
* !leaderboard -a {Leaderboard Name} {New Rows}
* RowName;RowName;RowName:Column1=2,Column2=4
*/
function createRow(msg, args) {
    args = checkCreateRowArgs(args);
    if (!args.valid) {
        winston.log('warn', arguments.loggerMessage);
        arguments.errorMethod(msg);
        return;
    }

    var collection = database.getCollection('leaderboards');
    collection.then(
        function(leaderboards) {
            for (var leaderboardIdx = 0; leaderboardIdx < leaderboards.length; leaderboardIdx++) {
                var leaderboard = leaderboards[leaderboardIdx];

                if (leaderboard.name == arguments.leaderboardName) {
                    for (var rowIdx = 0; rowIdx < arguments.rows.length; rowIdx++) {
                        var rowArg = arguments.rows[rowIdx];
                        var row = {};
                        row.name = rowArg.name;

                        for (var colIdx = 0; colIdx < leaderboard.columns.length; colIdx++) {
                            var colName = leaderboard.columns[colIdx];
                            if (typeof rowArg.values[colName] != 'undefined') {
                                row.values[colName] = rowArg.values[colName];
                            } else {
                                rowValues[colName] = 0;
                            }
                        }

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

function checkCreateRowArgs(args) {
    var arguments = {};
    args.shift();

    if (args.length != 2) {
        arguments.loggerMessage = 'Inccorect number of arguments to add row';
        arguments.errorMethod = helpMessages.printIncorrectArgumentsMessage;
        arguments.valid = false;
        return arguments;
    }

    var name = args[1];
    arguments.leaderboardName = name;

    var rowStrsToParse = args[2].split(';');
    var rows = [];
    for (rowStrIdx = 0; rowStrIdx < rowStrsToParse.length; rowStrIdx++) {
        var row = {};
        var rowStr = rowStrsToParse[rowStrIdx];
        rowStr = rowStr.split(':');

        row.name = rowStr[0];
        row.values = {};
        if (rowStr.length > 1) {
            var colValues = rowStr[1].split(',');
            for (var colIdx = 0; colIdx < colValues.length; colIdx++) {
                var colValueStr = colValues[colIdx];
                var colValue = colValueStr.split('=');
                if (colValue.length < 2) {
                    arguments.loggerMessage = 'Incorrect column arguments ' + colValueStr;
                    arguments.errorMethod = helpMessages.printRowIncorrectColumnsMessage;
                    arguments.valid = false;
                    return arguments;
                }

                var colName = colValue[0];
                var colVal = colValue[1];
                row.values[colName] = colVal;
            }
        }

        rows.push(row);
    }
    arguments.rows = rows;

    arguments.valid = true;

    return arguments;
}

// TODO: Move this to it's own file
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

// TODO: Delete row

module.exports = {
    createRow: createRow,
    updateRow: updateRow
}
