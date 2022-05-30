const { Client, Intents } = require("discord.js");
const moment = require("moment");
require("dotenv").config();

const token = process.env.token;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const channelId = process.env.channelid;

const FIRST_DAY_WORDLE = moment("2022-01-10T00:00:00");
const wordId = moment().startOf("day").diff(FIRST_DAY_WORDLE, "days") + 1;

client.once("ready", () => {
  console.log("Ready!");
  doRecapResultsOfDay();
});

const doRecapResultsOfDay = async () => {
  const channel = await client.channels.fetch(channelId);
  const messages = await channel.messages.fetch({ limit: 100 });

  console.log(`Received ${messages.size} messages`);

  const dictResult = getMessagesAssociatedToWordle(messages);
  const message = renderMessage(dictResult);
  channel.send(message);

  setTimeout(() => {
    console.log("job terminated");
    process.exit(1);
  }, 2000);
};

const getMessagesAssociatedToWordle = (messages) => {
  let dictionaryResults = {};
  messages.filter((message) => {
    if (message.content.includes("Le Mot (@WordleFR)")) {
      const messageContent: string = message.content;

      const contentMessage = messageContent.split("\n");
      const firstLine = contentMessage[0].split(" ");
      const wordIdMessage = firstLine[3];

      if (`#${wordId}` === wordIdMessage) {
        let result = "";

        if (message.content.includes("💀")) {
          result = Array.from(contentMessage[0])
            .slice(contentMessage[0].length - 4)
            .join("");
        } else {
          result = Array.from(contentMessage[0])
            .slice(contentMessage[0].length - 3)
            .join("");
        }

        let note = Array.from(result).slice(0, 1).join("");

        if (note === "💀") note = "mort";

        if (dictionaryResults.hasOwnProperty(note)) {
          const usersWithThisNote = dictionaryResults[note];
          usersWithThisNote.push(message.author.username);
        } else {
          const user = [message.author.username];
          dictionaryResults[note] = user;
        }
      }
    }
  });

  return dictionaryResults;
};

const renderMessage = (dictionaryResults: Object) => {
  let message = "";
  const keys = Object.keys(dictionaryResults);

  if (keys.length === 0) {
    message = "Personne n'a participé au mot du jour :(";
  } else {
    message = `Les résultats du mot #${wordId} :\n\n`;

    for (let note in dictionaryResults) {
      const users = dictionaryResults[note];
      const usersString = users.join(", ");

      if (note == "0") {
        message += `${usersString} : ${note} essai (jure ethan)\n`;
      } else if (note == "1") {
        message += `${usersString} : ${note} essai \n`;
      } else if (note === "mort") {
        message += `${usersString} : :skull:  \n`;
      } else {
        message += `${usersString} : ${note} essais \n`;
      }
    }
  }

  return message;
};

client.login(token);
