const { Client, Intents } = require('discord.js');
const moment = require('moment')
require('dotenv').config();

const token = process.env.token;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const channelId = "939514004789944341";

client.once('ready', () => {
	console.log('Ready!');
    doRecapResultsOfDay();
});

const doRecapResultsOfDay = () => {
    client.channels.fetch(channelId).then((channel) => {
        channel.messages.fetch({ limit: 100 }).then(messages => {
            console.log(`Received ${messages.size} messages`);
            const dictResult = getMessagesAssociatedToWordle(messages);
            const message = renderMessage(dictResult);
            channel.send(message);
        })        
    });
}

const getMessagesAssociatedToWordle = (messages) => {
    const FIRST_DAY_WORDLE = moment("2022-01-10T00:00:00");

    let dictionaryResults = {};
    messages.filter((message) => {
        if(message.content.includes("Le Mot (@WordleFR)")) {

            const wordId = moment().startOf('day').diff(FIRST_DAY_WORDLE, 'days') + 1;
            
            const contentMessage = message.content.split('\n');
            const firstLine = contentMessage[0].split(' ');
            const wordIdMessage =   firstLine[3];

            
            if(`#${wordId}` === wordIdMessage) {
                let result = "";

                if(message.content.includes("💀")) {
                    result = Array.from(contentMessage[0]).slice(contentMessage[0].length - 4).join('');
                } else {
                    result = Array.from(contentMessage[0]).slice(contentMessage[0].length - 3).join('');
                }
                
                let note = Array.from(result).slice(0, 1).join('');
    
                if(note === "💀") note = "mort";

                if(dictionaryResults.hasOwnProperty(note)) {
                    let usersWithThisNote = dictionaryResults[note];
                    usersWithThisNote.push(message.author.username);
                } else {
                    const user = [message.author.username];
                    dictionaryResults[note] = user;
                }
            }
        }
    });

    return dictionaryResults;
}

const renderMessage = (dictionaryResults) => {
    const FIRST_DAY_WORDLE = moment("2022-01-10T00:00:00");
    const wordId = moment().startOf('day').diff(FIRST_DAY_WORDLE, 'days') + 1;

    let message = `Les résultats du mot #${wordId} :\n\n`;

    for(let note in dictionaryResults) {
        const users = dictionaryResults[note];
        const usersString = users.join(', ');

        if(note == '0') {
            message += `${usersString} : ${note} essai (jure ethan)\n`;
        } else if(note == '1') {
            message += `${usersString} : ${note} essai \n`;
        } else if(note === "mort") {
            message += `${usersString} :  bien nul \n`;
        } else {
            message += `${usersString} : ${note} essais \n`;
        }
    }

    return message;
}

client.login(token);