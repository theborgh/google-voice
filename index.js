const fs = require("fs");
const configObj = require("./config");
const {
  readStats,
  writeStatsToFile,
  logStatsToConsole,
  wouldExceedQuota,
} = require("./stats");
const { checkForInvalidVoices } = require("./validation");
const { getVoiceType, writeOutputToFile } = require("./utils");

let stats = readStats();

async function readTranscript(stats) {
  let inputText = fs.readFileSync(configObj.inputFile, "utf8");
  const { characterVoices } = configObj;
  const initialStats = JSON.parse(JSON.stringify(stats));
  const chunks = inputText.split(configObj.chunkSplitRegExp);
  const audioContent = [];
  const startTime = new Date();
  const invalidVoiceIndex = checkForInvalidVoices(characterVoices);
  let voiceCode = (previousVoiceCode = configObj.defaultVoice);

  if (invalidVoiceIndex !== -1) {
    throw new Error(
      `Invalid voice code found in characterVoices array for regExp ${characterVoices[invalidVoiceIndex].regExp}: ${characterVoices[invalidVoiceIndex].voiceCode}`
    );
  }

  if (configObj.preprocessRegexp) {
    inputText = inputText.replace(
      configObj.preprocessRegexp,
      configObj.preprocessReplaceString
    );
  }

  for (const chunk of chunks) {
    let voiceFound = false;
    let voiceRegExp = null;
    let voiceCodeToUse = null;

    voiceCode = null;
    if (!configObj.stickyVoices) voiceCode = configObj.defaultVoice;

    for (const characterVoice of characterVoices) {
      if (chunk.match(characterVoice.regExp)) {
        voiceFound = true;
        voiceCode = characterVoice.voiceCode;
        voiceRegExp = characterVoice.regExp;
        break;
      }
    }

    if (!voiceFound) voiceCode = configObj.defaultVoice;

    voiceCodeToUse =
      !voiceFound && configObj.stickyVoices ? previousVoiceCode : voiceCode;
    previousVoiceCode = voiceCodeToUse;

    const textToSpeak = chunk.replace(voiceRegExp, "");

    if (wouldExceedQuota(stats, voiceCodeToUse, textToSpeak.length)) {
      throw new Error("Processing aborted, would exceed free quota!");
    }

    try {
      const response = await configObj.synthesizer.synthesize(
        configObj.synthesizer.createRequestObject(
          textToSpeak,
          voiceCodeToUse,
          configObj.outputFileFormat.toUpperCase()
        )
      );
      audioContent.push(
        configObj.synthesizer.mapResponseToAudioContent(response)
      );
    } catch (err) {
      throw new Error(
        `Error while processing chunk ${chunk} with voice ${voiceCodeToUse}: ${err.message}`
      );
    }

    // Update stats
    stats[getVoiceType(voiceCodeToUse) + " d"].charCount += textToSpeak.length;
    stats[getVoiceType(voiceCodeToUse) + " m"].charCount += textToSpeak.length;
  }

  writeOutputToFile(audioContent, configObj);
  logStatsToConsole(stats, initialStats, startTime, configObj);

  return stats;
}

try {
  stats = readTranscript(stats);
  console.log("Stats object: ", stats);
} catch (err) {
  console.error("Error: ", err);
} finally {
  writeStatsToFile(stats);
}
