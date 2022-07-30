import { ChannelLogsQueryOptions, TextChannel } from "discord.js";

const medalsEmojis = [":first_place:", "", ":second_place:", ":third_place:"];

type AllResults = Record<
  string,
  {
    wordsCompleted: number;
    countTries: number;
  }
>;

type UserMeanWordle = Record<string, number>;

export const getStatsByUser = (messages: string[]): AllResults => {
  const allResultsMessages = messages.filter((message) => message.includes("Les résultats du mot"));

  const allLineResults = allResultsMessages.reduce<string[]>((acc, message) => {
    const lines = message.split("\n");
    const resultsLines = lines.slice(2);

    return [...acc, ...resultsLines.filter((resultLine) => resultLine.trim() !== "")];
  }, []);

  const allResults = allLineResults.reduce<AllResults>((acc, result) => {
    const [names, countTriesMessage] = result.split(" : ");

    const countTries = hasUserLosed(countTriesMessage) ? 6 : parseInt(countTriesMessage);

    return addUserToDictionary(acc, names.split(", "), countTries);
  }, {});

  return allResults;
};

const addUserToDictionary = (acc: AllResults, names: string[], countTries: number) => {
  const newAcc = { ...acc };

  names.forEach((name) => {
    if (newAcc[name]) {
      newAcc[name].countTries += countTries;
      newAcc[name].wordsCompleted += 1;
    } else {
      newAcc[name] = {
        wordsCompleted: 1,
        countTries: countTries,
      };
    }
  });

  return newAcc;
};

const hasUserLosed = (messageResult: string) => {
  const userLosed = !messageResult.includes("essai");

  return userLosed;
};

export const getMeansByUsers = (stats: AllResults): UserMeanWordle => {
  const usersMeans = Object.keys(stats).reduce<UserMeanWordle>((acc, user) => {
    const newAcc = { ...acc };

    const { wordsCompleted, countTries } = stats[user];
    const mean = countTries / wordsCompleted;

    newAcc[user] = mean;

    return newAcc;
  }, {});

  const sortedUsersMeans = Object.keys(usersMeans)
    .sort((a, b) => usersMeans[a] - usersMeans[b])
    .reduce<UserMeanWordle>((acc, user) => {
      const newAcc = { ...acc };
      newAcc[user] = usersMeans[user];
      return newAcc;
    }, {});

  return sortedUsersMeans;
};

const getCountDecimals = (number: number) => {
  if (Math.floor(number.valueOf()) === number.valueOf()) return 0;
  return number.toString().split(".")[1].length || 0;
};

const getEndMessage = (user: string, index: number): string => {
  if (user === "Poogz") {
    return `${user === "Poogz" ? "(Tricheur :poop:)" : ""}`;
  }

  if (index <= 4) {
    return `${medalsEmojis[index - 1]}`;
  }

  return "";
};

export const getGlobalStatsMessage = (usersMeans: UserMeanWordle) => {
  const introductionMessage = "Les stats finales pour WORDLE ! (finito <:thumb:933060821968384010>)\n\n";

  const statsLines = Object.keys(usersMeans).reduce((acc, user, i) => {
    const userMean = usersMeans[user];
    const isDecimalNumber = getCountDecimals(userMean) > 0;

    const mean = isDecimalNumber ? userMean.toFixed(2) : userMean;

    const startMessage = `${user} :`;
    const endMessage = getEndMessage(user, i);

    if (user === "Akairo2" || user === "Poogz") {
      return acc;
    }

    if (mean === 1) {
      return acc + `${startMessage} ${mean} essai ${endMessage} \n`;
    }

    if (!isDecimalNumber) {
      return acc + `${startMessage} ${mean} essais ${endMessage} \n`;
    }

    return acc + `${startMessage} ~ ${mean} essais ${endMessage} \n`;
  }, "");

  return introductionMessage + statsLines + "Poogz : 1 essai (Tricheur :poop:)";
};

export const getWordsCompletedMessage = (stats: AllResults) => {
  const statsLines = Object.keys(stats).reduce((acc, user) => {
    const { wordsCompleted } = stats[user];

    if (user === "Akairo2" || user === "Poogz") {
      return acc;
    }

    return acc + `${user} : ${wordsCompleted} mots joués \n`;
  }, "");

  const { wordsCompleted } = stats["Poogz"];

  return statsLines + `Poogz : ${wordsCompleted} mot joué :poop:`;
};
