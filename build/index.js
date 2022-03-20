var _a = require('discord.js'), Client = _a.Client, Intents = _a.Intents;
var moment = require('moment');
require('dotenv').config();
var token = process.env.token;
var client = new Client({ intents: [Intents.FLAGS.GUILDS] });
var channelId = process.env.channelid;
var FIRST_DAY_WORDLE = moment("2022-01-10T00:00:00");
var wordId = moment().startOf('day').diff(FIRST_DAY_WORDLE, 'days') + 1;
client.once('ready', function () {
    console.log('Ready!');
    doRecapResultsOfDay();
});
var doRecapResultsOfDay = function () {
    client.channels.fetch(channelId).then(function (channel) {
        // channel.send("cc");
        channel.messages.fetch({ limit: 100 }).then(function (messages) {
            console.log("Received ".concat(messages.size, " messages"));
            var dictResult = getMessagesAssociatedToWordle(messages);
            var message = renderMessage(dictResult);
            channel.send(message);
            console.log("job terminated");
            // process.exit(1);
        });
    });
};
var getMessagesAssociatedToWordle = function (messages) {
    var dictionaryResults = {};
    messages.filter(function (message) {
        if (message.content.includes("Le Mot (@WordleFR)")) {
            var messageContent = message.content;
            var contentMessage = messageContent.split('\n');
            var firstLine = contentMessage[0].split(' ');
            var wordIdMessage = firstLine[3];
            if ("#".concat(wordId) === wordIdMessage) {
                var result = "";
                if (message.content.includes("💀")) {
                    result = Array.from(contentMessage[0]).slice(contentMessage[0].length - 4).join('');
                }
                else {
                    result = Array.from(contentMessage[0]).slice(contentMessage[0].length - 3).join('');
                }
                var note = Array.from(result).slice(0, 1).join('');
                if (note === "💀")
                    note = "mort";
                if (dictionaryResults.hasOwnProperty(note)) {
                    var usersWithThisNote = dictionaryResults[note];
                    usersWithThisNote.push(message.author.username);
                }
                else {
                    var user = [message.author.username];
                    dictionaryResults[note] = user;
                }
            }
        }
    });
    return dictionaryResults;
};
var renderMessage = function (dictionaryResults) {
    var message = "";
    if (dictionaryResults === {}) {
        message = "Personne n'a participé au mot du jour :(";
    }
    else {
        message = "Les r\u00E9sultats du mot #".concat(wordId, " :\n\n");
        for (var note in dictionaryResults) {
            var users = dictionaryResults[note];
            var usersString = users.join(', ');
            if (note == '0') {
                message += "".concat(usersString, " : ").concat(note, " essai (jure ethan)\n");
            }
            else if (note == '1') {
                message += "".concat(usersString, " : ").concat(note, " essai \n");
            }
            else if (note === "mort") {
                message += "".concat(usersString, " :  bien nul \n");
            }
            else {
                message += "".concat(usersString, " : ").concat(note, " essais \n");
            }
        }
    }
    return message;
};
client.login(token);
//# sourceMappingURL=index.js.map