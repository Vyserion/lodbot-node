const database = require('../../util/database');
const helpMessages = require('./helpMessages');

const winston = require('winston');
const _ = require('lodash');

/**
* Creates a new leaderboard.
* Accepts a command of the following format:
* !leaderboard -a {leaderboard name} {columns}
*/
function createLeaderboard(msg, args) {
    args = checkCreateLeaderboardArgs(args);
    if (!args.valid) {
        winston.log('warn', arguments.loggerMessage);
        arguments.errorMethod(msg);
        return;
    }

    var collection = database.getCollection('leaderboards');
    collection.then(
        function(leaderboards) {
            for (var leaderboardIdx = 0; leaderboardIdx < leaderboards.length; leaderboardIdx++) {
                if (leaderboards[leaderboardIdx].name == arguments.leaderboardName) {
                    winston.log('warn', 'Leaderboard with that name already exists.');
                    helpMessages.printLeaderboardExistsMessage(msg, arguments.leaderboardName);
                    return;
                }
            }

            var leaderboard = {
                columns: arguments.columns,
                name: arguments.leaderboardName,
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

function checkCreateLeaderboardArgs(args) {
    var arguments = {};
    args.shift();

    if (args.length != 2) {
        arguments.loggerMessage = 'Incorrect number of arguments for new leaderboard';
        arguments.errorMethod = helpMessages.printIncorrectArgumentsMessage;
        arguments.valid = false;
        return arguments;
    }

    var name = args[1];
    arguments.leaderboardName = name;
    
    var columnNames = args[2].split(',');
    columnNames = _.uniq(columnNames);
    arguments.columnNames = columnNames;

    arguments.valid = true;

    return arguments;
}

// TODO: Update leaderboard

// TODO: Delete leaderboard

module.exports = {
    createLeaderboard: createLeaderboard
}
