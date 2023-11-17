const fs = require("fs");

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

module.exports = { readStats, writeStats };
