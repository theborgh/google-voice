const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const util = require("util");
const { voicePool, freeTiers } = require("./googleVoiceData");
const { defaultVoice, characterVoices } = require("./inputVoiceData");
const { readStats, writeStats } = require("./stats");

async function readTranscript() {
  const inputText = fs.readFileSync("input.txt", "utf8");
  const stats = readStats();

  const chunks = inputText.split("\r\n\r\n");
  const audioContent = [];
  const startTime = new Date();
  const client = new textToSpeech.TextToSpeechClient();

  for (const chunk of chunks) {
    let voiceCode = defaultVoice;
    let voiceSeparator = null;

    for (const characterVoice of characterVoices) {
      if (chunk.match(characterVoice.separator)) {
        voiceCode = characterVoice.voiceCode;
        voiceSeparator = characterVoice.separator;
        break;
      }
    }

    const request = {
      input: { text: chunk.replace(voiceSeparator, "") },
      voice: {
        languageCode: voiceCode.split("-")[0] + "-" + voiceCode.split("-")[1],
        name: voiceCode,
      },
      audioConfig: { audioEncoding: "MP3" },
    };

    const [response] = await client.synthesizeSpeech(request);
    audioContent.push(response.audioContent);

    // update stats
    stats[
      voicePool.find((v) => v.voiceCode === voiceCode).voiceType + " d"
    ].charCount += chunk.replace(voiceSeparator, "").length;
    stats[
      voicePool.find((v) => v.voiceCode === voiceCode).voiceType + " m"
    ].charCount += chunk.replace(voiceSeparator, "").length;
  }

  const concatenatedAudio = Buffer.concat(audioContent);

  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile("output.mp3", concatenatedAudio, "binary");
  const endTime = new Date();

  // Write updated stats to file
  console.log("Updated stats: ", stats);
  writeStats(stats);

  console.log(
    `Audio content generated in ${
      (endTime - startTime) / 1000
    } seconds and written to output.mp3`
  );
}

readTranscript();
