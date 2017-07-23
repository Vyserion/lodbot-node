const winston = require('winston');
const database = require('../util/database');

const keyword = 'leaderboard';
const NEW_LEADERBOARD_COMMAND = '-n';
const NEW_ROW_COMMAND = '-a';

function doAction(msg, args) {
    args = args.split(' ');

    if (args.length == 0) {
        winston.log('warn', 'No arguments detected');
        // TODO: Help message here
    }

    switch (args[0]) {
        case NEW_LEADERBOARD_COMMAND:
            addNewLeaderboard(args);
            break;
        case NEW_ROW_COMMAND:
            addNewRow(args);
            break;
        default:
            return; // UNKNOWN COMMAND. TODO: Help
    }
}

function addNewLeaderboard(args) {
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

function addNewRow(args) {
    // Expected input
    // !leaderboard -a {Leaderboard Name} {Row Name}
    if (args.length < 3) {
        winston.log('error', 'Inccorect number of arguments to add row');
        // TODO: Help message
        return;
    }

    var leaderboardName = args[1];
    var collection = database.getCollection('leaderboards', leaderboardName);
    console.log(collection);
    collection.then(function(docs) {
        for (var i = 0; i < docs.length; i++) {
            var doc = docs[i];
            if (doc.name == leaderboardName) {
                var rowName = args[2];
                var row = {
                    name: rowName,
                    values: []
                };
                doc.rows.push(row);
                database.updateInCollection('leaderboards', doc);
                return;
            }
        }
    });
}

module.exports = {
    keyword: keyword,
    doAction: doAction
}
