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
    response += '    - *Row Names* - The name of the row to add. For multiple rows, these can be seperated by commas.\n';
    response += '    - *Row Values* - Optional. Allows rows to be created with values. Used in the format of ColumnName:Value. Seperated by semicolons. Each row is seperated by commas. If provided for one column, must be provided for all.';
    response += 'For example: \n';
    response += '    !leaderboard -a {Leaderboard Name} {Row Names} {Row Values}\n';
    response += '    !leaderboard -a LeaderboardName NewRowName,NewRowName2 Column1:1;Column2:2,Column1:1;Column2:3\n\n';
    // Update Row
    response += '**Update Row** \n';
    response += '-u \n';
    response += 'Updates a row to the given values. It requires the following information: \n';
    response += '    - *Leaderboard Name* - The name of the leaderboard to update. \n';
    response += '    - *Row Name* - The name of the row to update \n';
    response += '    - *Values* - The values to update. This is in the format ColumnName:Value. Each column is seperated by commas.\n';
    response += 'For example: \n';
    response += '    !leaderboard -u {Leaderboard Name} {Row Name} {Values} \n';
    response += '    !leaderboard -u LeaderboardName RowName ColumnOne:1,ColumnTwo:2';

    msg.reply(response);
}

function printUnknownCommandMessage(msg) {
    var response = 'That command wans\'t recognised. Please check the help message for what commands are available.';
    msg.reply(response);
}

function printIncorrectArgumentsMessage(msg) {
    var response = 'We need more arguments than what has been provided. Please check the help message for correct usage.';
    msg.reply(response);
}

function printLeaderboardExistsMessage(msg, leaderboardName) {
    var response = 'A leaderboard already exists with the name ' + leaderboardName + '. Please try another name.';
    msg.reply(response);
}

function printNewLeaderboardMessage(msg, name) {
    var response = 'Leaderboard ' + name + ' created!';
    msg.reply(response);
}

function printErrorMessage(msg) {
    var response = 'Error creating leaderboard. Please contact the administrator.';
    msg.reply(response);
}

function printLeaderboardNotFoundMessage(msg, leaderboardName) {
    var response = 'No leaderboard could be found with the name ' + leaderboardName + '. Please check the list.';
    msg.reply(response);
}

module.exports = {
    printNoArgumentsMessage: printNoArgumentsMessage,
    printHelpMessage: printHelpMessage,
    printUnknownCommandMessage: printUnknownCommandMessage,
    printIncorrectArgumentsMessage: printIncorrectArgumentsMessage,
    printLeaderboardExistsMessage: printLeaderboardExistsMessage,
    printNewLeaderboardMessage: printNewLeaderboardMessage,
    printErrorMessage: printErrorMessage,
    printLeaderboardNotFoundMessage: printLeaderboardNotFoundMessage
}
