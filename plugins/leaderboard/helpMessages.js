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
    printNoArgumentsMessage: printNoArgumentsMessage,
    printHelpMessage: printHelpMessage,
    printUnknownCommandMessage: printUnknownCommandMessage
}
