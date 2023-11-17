const fs = require("fs");
const { freeTiers, voiceCodes } = require("./googleVoiceData");

const readStats = () => {
  const statsText = fs.readFileSync("stats.csv", "utf8");
  const entries = statsText.split("\r\n");
  const stats = {};
  const today = new Date();

  for (const entry of entries) {
    const [voiceType, period, charCount] = entry.split(",");
    stats[voiceType] = { period, charCount: parseInt(charCount) };
  }

  // update stats if needed
  for (const entry in stats) {
    if (
      entry.toString().split(" ")[1] === "d" &&
      stats[entry].period !== today.toISOString().slice(0, 10)
    ) {
      stats[entry].period = today.toISOString().slice(0, 10);
      stats[[entry].toString().split(" ")[0] + " m"].charCount +=
        stats[entry].charCount;
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

const writeStats = (stats) => {
  const statsText = Object.keys(stats)
    .map((key) => {
      return `${key},${stats[key].period},${stats[key].charCount}`;
    })
    .join("\r\n");

  fs.writeFileSync("stats.csv", statsText, "utf8");
};

const logStats = (stats) => {
  console.log("Stats:");
  for (entry in stats) {
    const budget = freeTiers.find(
      (e) => e.voiceType === entry.split(" ")[0]
    ).freeCharsPerMonth;
    console.log(
      `${entry}: ${stats[entry].charCount} (${(
        (stats[entry].charCount * 100) /
        budget
      ).toFixed(2)}% of monthly free tier)`
    );
  }
};

const wouldExceedQuota = (stats, voiceCode, nextChunkLength) => {
  const voiceType = Object.entries(voiceCodes)
    .find((v) => v[1] === voiceCode)[0]
    .split("_")[1];
  const statsEntry = stats[voiceType + " m"];
  const budget = freeTiers.find(
    (e) => e.voiceType === voiceType
  ).freeCharsPerMonth;

  console.log(
    `${voiceType}: ${
      statsEntry.charCount
    } + ${nextChunkLength} of ${budget} chars (${(
      ((statsEntry.charCount + nextChunkLength) * 100) /
      budget
    ).toFixed(2)}% of monthly free tier)`
  );

  return statsEntry.charCount + nextChunkLength >= budget;
};

module.exports = { readStats, writeStats, logStats, wouldExceedQuota };
