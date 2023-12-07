const fs = require("fs");
const configObj = require("./config");
const { freeTiers } = require("./googleVoiceData");
const { getVoiceType } = require("./utils");

const areStatsValid = (stats) => {
  if (Object.keys(stats).length < 2) return false;

  for (const entry in stats) {
    if (entry.toString().split(" ")[1] === "d") {
      if (stats[entry]?.period?.length !== 10) return false;
    } else if (entry.toString().split(" ")[1] === "m") {
      if (stats[entry]?.period?.length !== 7) return false;
    } else {
      return false;
    }
  }

  return true;
};

const readStats = () => {
  const statsText = fs.readFileSync("stats.csv", "utf8");
  const entries = statsText.split("\r\n");
  let stats = {};
  const today = new Date();

  for (const entry of entries) {
    const [voiceType, period, charCount] = entry.split(",");
    stats[voiceType] = { period, charCount: parseInt(charCount) };
  }

  console.log("Attempting to read stats from file: ", stats);

  if (!areStatsValid(stats)) {
    console.log("Stats are invalid, resetting to today's date");

    stats = {};
    configObj.loggedVoiceTypes.forEach((voiceType) => {
      stats[voiceType + " d"] = {
        period: today.toISOString().slice(0, 10),
        charCount: 0,
      };
      stats[voiceType + " m"] = {
        period: today.toISOString().slice(0, 7),
        charCount: 0,
      };
    });
  }

  // Update stats if needed
  for (const entry in stats) {
    if (
      entry.toString().split(" ")[1] === "d" &&
      stats[entry].period !== today.toISOString().slice(0, 10)
    ) {
      stats[entry].period = today.toISOString().slice(0, 10);
      stats[entry].charCount = 0;
    }

    if (
      entry.toString().split(" ")[1] === "m" &&
      stats[entry].period !== today.toISOString().slice(0, 7)
    ) {
      stats[entry].period = today.toISOString().slice(0, 7);
      stats[entry].charCount = 0;
    }
  }

  return stats;
};

const writeStatsToFile = (stats) => {
  const statsText = Object.keys(stats)
    .map((key) => {
      return `${key},${stats[key].period},${stats[key].charCount}`;
    })
    .join("\r\n");

  fs.writeFileSync("stats.csv", statsText, "utf8");
};

const logStatsToConsole = (stats, initialStats, startTime, configObj) => {
  const endTime = new Date();

  console.log("\nStats:");
  for (entry in stats) {
    if (entry.toString().split(" ")[1] === "m") {
      const budget = freeTiers.find(
        (e) => e.voiceType === entry.split(" ")[0]
      ).freeCharsPerMonth;
      console.log(
        `${entry}: ${stats[entry].charCount} (${(
          (stats[entry].charCount * 100) /
          budget
        ).toFixed(2)}% of monthly free tier used so far, ${
          stats[entry].charCount - initialStats[entry].charCount
        } chars or ${(
          ((stats[entry].charCount - initialStats[entry].charCount) * 100) /
          budget
        ).toFixed(2)}% of budget just used)`
      );
    }
  }

  console.log(
    `Audio content generated in ${
      (endTime - startTime) / 1000
    } seconds and written to ${configObj.outputFile}.${
      configObj.outputFileFormat
    }`
  );
};

const wouldExceedQuota = (stats, voiceCode, nextChunkLength) => {
  const voiceType = getVoiceType(voiceCode);
  const statsEntry = stats[voiceType + " m"];
  const budget = freeTiers.find(
    (e) => e.voiceType === voiceType
  ).freeCharsPerMonth;

  console.log(
    `${voiceType}: projected use is ${
      statsEntry.charCount
    } + ${nextChunkLength} of ${budget} monthly chars (${(
      ((statsEntry.charCount + nextChunkLength) * 100) /
      budget
    ).toFixed(2)}% of free tier)`
  );

  return statsEntry.charCount + nextChunkLength > budget;
};

module.exports = {
  readStats,
  writeStatsToFile,
  logStatsToConsole,
  wouldExceedQuota,
};
