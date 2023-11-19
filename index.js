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

async function readTranscript() {
  let inputText = fs.readFileSync(configObj.inputFile, "utf8");
  const stats = readStats();
  const { characterVoices } = configObj;
  const initialStats = JSON.parse(JSON.stringify(stats));
  const chunks = inputText.split(configObj.chunkSplitRegExp);
  const audioContent = [];
  const startTime = new Date();
  const invalidVoiceIndex = checkForInvalidVoices(characterVoices);
  let previousVoiceCode = null;
  let voiceCode = configObj.defaultVoice;
  let voiceCodeToUse = null;

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
    if (!configObj.stickyVoices) voiceCode = configObj.defaultVoice;
    let voiceRegExp = null;
    let keepText = null;

    for (const characterVoice of characterVoices) {
      if (chunk.match(characterVoice.regExp)) {
        voiceFound = true;
        previousVoiceCode = voiceCode;
        voiceCode = characterVoice.voiceCode;
        voiceRegExp = characterVoice.regExp;
        keepText = characterVoice.keepText;
        break;
      }
    }

    const textToSpeak =
      configObj.removeVoiceRegexpFromInput && !keepText
        ? chunk.replace(voiceRegExp, "")
        : chunk;

    voiceCodeToUse =
      !voiceFound && configObj.stickyVoices && previousVoiceCode
        ? previousVoiceCode
        : voiceCode;

    if (wouldExceedQuota(stats, voiceCodeToUse, textToSpeak.length)) {
      throw new Error("Processing aborted, would exceed free quota!");
    }

    try {
      const response = await configObj.synthesizer.synthesize(
        configObj.synthesizer.createRequestObject(
          textToSpeak,
          voiceCode,
          previousVoiceCode,
          configObj,
          voiceCodeToUse
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
    stats[getVoiceType(voiceCode) + " d"].charCount += textToSpeak.length;
    stats[getVoiceType(voiceCode) + " m"].charCount += textToSpeak.length;
  }

  writeOutputToFile(audioContent, configObj);
  logStatsToConsole(stats, initialStats, startTime, configObj);
  writeStatsToFile(stats);
}

try {
  readTranscript();
} catch (err) {
  console.error("Error: ", err);
}
