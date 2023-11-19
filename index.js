const fs = require("fs");
const { defaultVoice, characterVoices, configObj } = require("./config");
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
  const initialStats = JSON.parse(JSON.stringify(stats));
  const chunks = inputText.split(configObj.chunkSplitRegExp);
  const audioContent = [];
  const startTime = new Date();
  const invalidVoiceIndex = checkForInvalidVoices(characterVoices);
  let previousVoiceCode = null;
  let voiceCode = defaultVoice;
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
    if (!configObj.stickyVoices) voiceCode = defaultVoice;
    let voiceRegExp = null;
    const textToSpeak = configObj.removeVoiceRegexpFromInput
      ? chunk.replace(voiceRegExp, "")
      : chunk;

    for (const characterVoice of characterVoices) {
      if (chunk.match(characterVoice.regExp)) {
        previousVoiceCode = voiceCode;
        voiceCode = characterVoice.voiceCode;
        voiceRegExp = characterVoice.regExp;
        break;
      }
    }

    voiceCodeToUse =
      voiceCode === defaultVoice && previousVoiceCode && configObj.stickyVoices
        ? previousVoiceCode
        : voiceCode;

    if (wouldExceedQuota(stats, voiceCodeToUse, textToSpeak.length)) {
      throw new Error("Processing aborted, would exceed free quota!");
    }

    try {
      const response = await configObj.synthesizer.synthesize(
        configObj.synthesizer.createRequest(
          textToSpeak,
          voiceCode,
          defaultVoice,
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
