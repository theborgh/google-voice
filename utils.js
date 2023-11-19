const { voiceCodes } = require("./googleVoiceData");

const getVoiceType = (voiceCode) =>
  Object.entries(voiceCodes)
    .find((v) => v[1] === voiceCode)[0]
    .split("_")[1];

const writeOutputToFile = async (audioContent, configObj) => {
  await fs.writeFileSync(
    `${configObj.outputFile}.${configObj.outputFileFormat}`,
    Buffer.concat(audioContent),
    "binary"
  );
};

module.exports = { getVoiceType, writeOutputToFile };
