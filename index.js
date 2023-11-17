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

async function readTranscript() {
  const inputText = fs.readFileSync(configObj.inputFile, "utf8");
  const stats = readStats();
  const chunks = inputText.split(configObj.chunkSplitRegExp);
  const audioContent = [];
  const startTime = new Date();
  const client = new textToSpeech.TextToSpeechClient();
  let previousVoice = null;

  for (const chunk of chunks) {
    let voiceCode = defaultVoice;
    let voiceRegExp = null;

    for (const characterVoice of characterVoices) {
      if (chunk.match(characterVoice.regExp)) {
        previousVoice = voiceCode;
        voiceCode = characterVoice.voiceCode;
        voiceRegExp = characterVoice.regExp;
        break;
      }
    }

    if (wouldExceedQuota(stats, voiceCode, chunk.length)) {
      console.log("Finished processing, would exceed quota!");
      break;
    }

    const request = {
      input: {
        text: configObj.removeVoiceRegexpFromInput
          ? chunk.replace(voiceRegExp, "")
          : chunk,
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
      audioConfig: { audioEncoding: "MP3" },
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
  await writeFile("output.mp3", concatenatedAudio, "binary");
  const endTime = new Date();

  // Write updated stats to file
  logStatsToConsole(stats);
  writeStatsToFile(stats);

  console.log(
    `Audio content generated in ${
      (endTime - startTime) / 1000
    } seconds and written to output.mp3`
  );
}

readTranscript();
