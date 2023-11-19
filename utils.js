const { voiceCodes } = require("./googleVoiceData");

const getVoiceType = (voiceCode) =>
  Object.entries(voiceCodes)
    .find((v) => v[1] === voiceCode)[0]
    .split("_")[1];

module.exports = { getVoiceType };
