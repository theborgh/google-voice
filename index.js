const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const util = require("util");
const { voiceCodes } = require("./googleVoiceData");
const { defaultVoice, characterVoices, configObj } = require("./config");
const {
  readStats,
  writeStats: writeStatsToFile,
  logStats: logStatsToConsole,
  wouldExceedQuota,
} = require("./stats");
const { checkForInvalidVoices } = require("./validation");

async function readTranscript() {
  let inputText = fs.readFileSync(configObj.inputFile, "utf8");
  const stats = readStats();
  const initialStats = JSON.parse(JSON.stringify(stats));
  const chunks = inputText.split(configObj.chunkSplitRegExp);
  const audioContent = [];
  const startTime = new Date();
  const client = new textToSpeech.TextToSpeechClient();
  let previousVoice = null;
  let voiceCode = defaultVoice;

  if (configObj.preprocessRegexp) {
    inputText = inputText.replace(
      configObj.preprocessRegexp,
      configObj.preprocessReplaceString
    );
  }

  const invalidCodeIndex = checkForInvalidVoices(characterVoices);
  if (invalidCodeIndex !== -1) {
    throw new Error(
      `Invalid voice code found in characterVoices array for regExp ${characterVoices[invalidCodeIndex].regExp}: ${characterVoices[invalidCodeIndex].voiceCode}`
    );
  }

  for (const chunk of chunks) {
    if (!configObj.stickyVoices) voiceCode = defaultVoice;
    let voiceRegExp = null;
    let textToSpeak = null;

    for (const characterVoice of characterVoices) {
      if (chunk.match(characterVoice.regExp)) {
        previousVoice = voiceCode;
        voiceCode = characterVoice.voiceCode;
        voiceRegExp = characterVoice.regExp;
        break;
      }
    }

    textToSpeak = configObj.removeVoiceRegexpFromInput
      ? chunk.replace(voiceRegExp, "")
      : chunk;

    if (wouldExceedQuota(stats, voiceCode, textToSpeak.length)) {
      console.log("Processing aborted, would exceed free quota!");
      break;
    }

    const request = {
      input: {
        text: textToSpeak,
      },
      voice: {
        languageCode:
          voiceCode === defaultVoice && previousVoice && configObj.stickyVoices
            ? previousVoice.split("-")[0] + "-" + previousVoice.split("-")[1]
            : voiceCode.split("-")[0] + "-" + voiceCode.split("-")[1],
        name:
          voiceCode === defaultVoice && previousVoice && configObj.stickyVoices
            ? previousVoice
            : voiceCode,
      },
      audioConfig: { audioEncoding: configObj.outputFileFormat.toUpperCase() },
    };

    const [response] = await client.synthesizeSpeech(request);
    audioContent.push(response.audioContent);

    // update stats
    stats[
      Object.entries(voiceCodes)
        .find((v) => v[1] === voiceCode)[0]
        .split("_")[1] + " d"
    ].charCount += chunk.replace(voiceRegExp, "").length;
    stats[
      Object.entries(voiceCodes)
        .find((v) => v[1] === voiceCode)[0]
        .split("_")[1] + " m"
    ].charCount += chunk.replace(voiceRegExp, "").length;
  }

  const concatenatedAudio = Buffer.concat(audioContent);

  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(
    `${configObj.outputFile}.${configObj.outputFileFormat}`,
    concatenatedAudio,
    "binary"
  );
  const endTime = new Date();

  logStatsToConsole(stats, initialStats, startTime, endTime, configObj);
  writeStatsToFile(stats);
}

try {
  readTranscript();
} catch (err) {
  console.error("Error validating character voices: ", err);
}
