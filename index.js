const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const util = require("util");
const { defaultVoice, characterVoices, configObj } = require("./config");
const {
  readStats,
  writeStatsToFile,
  logStatsToConsole,
  wouldExceedQuota,
} = require("./stats");
const { checkForInvalidVoices } = require("./validation");
const { getVoiceType } = require("./utils");

async function readTranscript() {
  let inputText = fs.readFileSync(configObj.inputFile, "utf8");
  const stats = readStats();
  const initialStats = JSON.parse(JSON.stringify(stats));
  const chunks = inputText.split(configObj.chunkSplitRegExp);
  const audioContent = [];
  const client = new textToSpeech.TextToSpeechClient();
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

    const request = {
      input: {
        text: textToSpeak,
      },
      voice: {
        languageCode:
          voiceCode === defaultVoice &&
          previousVoiceCode &&
          configObj.stickyVoices
            ? previousVoiceCode.split("-")[0] +
              "-" +
              previousVoiceCode.split("-")[1]
            : voiceCode.split("-")[0] + "-" + voiceCode.split("-")[1],
        name: voiceCodeToUse,
      },
      audioConfig: { audioEncoding: configObj.outputFileFormat.toUpperCase() },
    };

    try {
      const [response] = await client.synthesizeSpeech(request);
      audioContent.push(response.audioContent);
    } catch (err) {
      throw new Error(
        `Error while processing chunk ${chunk} with voice ${voiceCodeToUse}: ${err}`
      );
    }

    // Update stats
    stats[getVoiceType(voiceCode) + " d"].charCount += textToSpeak.length;
    stats[getVoiceType(voiceCode) + " m"].charCount += textToSpeak.length;
  }

  // Write the binary audio content to local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(
    `${configObj.outputFile}.${configObj.outputFileFormat}`,
    Buffer.concat(audioContent),
    "binary"
  );

  logStatsToConsole(stats, initialStats, startTime, configObj);
  writeStatsToFile(stats);
}

try {
  readTranscript();
} catch (err) {
  console.error("Error: ", err);
}
