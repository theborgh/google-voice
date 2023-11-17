const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const util = require("util");

const client = new textToSpeech.TextToSpeechClient();

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

async function readTranscript() {
  const inputText = fs.readFileSync("input.txt", "utf8");
  const stats = readStats();

  console.log(stats);

  const freeTiers = [
    { voiceType: "Neural2", freeCharsPerMonth: 800_000 }, // 1_000_000 bytes
    { voiceType: "Polyglot", freeCharsPerMonth: 800_000 }, // 1_000_000 bytes
    { voiceType: "Studio", freeCharsPerMonth: 80_000 }, // 100_000 bytes
    { voiceType: "WaveNet", freeCharsPerMonth: 1_000_000 },
    { voiceType: "Standard", freeCharsPerMonth: 4_000_000 },
  ];

  // See voices at https://cloud.google.com/text-to-speech/docs/voices
  const voicePool = [
    { voiceCode: "en-GB-News-H", sex: "female", voiceType: "WaveNet" },
    { voiceCode: "en-AU-Standard-A", sex: "female", voiceType: "Standard" },
    { voiceCode: "en-US-News-L", sex: "female", voiceType: "WaveNet" },
    { voiceCode: "fil-PH-Wavenet-A", sex: "female", voiceType: "WaveNet" },
    { voiceCode: "en-IN-Standard-D", sex: "female", voiceType: "Standard" },
    { voiceCode: "en-US-News-N", sex: "male", voiceType: "WaveNet" },
    { voiceCode: "en-US-Wavenet-J", sex: "male", voiceType: "WaveNet" },
    { voiceCode: "en-US-Neural2-D", sex: "male", voiceType: "Neural2" },
    { voiceCode: "en-IN-Neural2-B", sex: "male", voiceType: "Neural2" },
    { voiceCode: "en-US-Polyglot-1", sex: "male", voiceType: "Standard" },
    { voiceCode: "ja-JP-Wavenet-D", sex: "male", voiceType: "WaveNet" },
    { voiceCode: "de-DE-Neural2-B", sex: "male", voiceType: "Neural2" },
  ];

  const characterVoices = [
    { separator: /^Q[\.:]/, voiceCode: "en-US-Wavenet-J" },
    { separator: /^(A[\.:]|THE WITNESS:)/, voiceCode: "en-IN-Neural2-B" },
    { separator: /^THE CLERK:/, voiceCode: "en-IN-Standard-D" },
    { separator: /^THE COURT:/, voiceCode: "ja-JP-Wavenet-D" },
    { separator: /^MR. BAKER:/, voiceCode: "en-US-Wavenet-J" },
    { separator: /^MR. P. BAKER:/, voiceCode: "en-US-Polyglot-1" },
    { separator: /^MR. PETROCELLI:/, voiceCode: "en-US-News-N" },
  ];
  const defaultVoice = "de-DE-Neural2-B";

  const chunks = inputText.split("\r\n\r\n");
  const audioContent = [];
  const startTime = new Date();

  // for (const chunk of chunks) {
  //   // Get the voice code for the chunk
  //   let voiceCode = defaultVoice;
  //   let voiceSeparator = null;

  //   for (const characterVoice of characterVoices) {
  //     if (chunk.match(characterVoice.separator)) {
  //       voiceCode = characterVoice.voiceCode;
  //       voiceSeparator = characterVoice.separator;
  //       break;
  //     }
  //   }

  //   const request = {
  //     input: { text: chunk.replace(voiceSeparator, "") },
  //     voice: {
  //       languageCode: voiceCode.split("-")[0] + "-" + voiceCode.split("-")[1],
  //       name: voiceCode,
  //     },
  //     audioConfig: { audioEncoding: "MP3" },
  //   };

  //   const [response] = await client.synthesizeSpeech(request);
  //   audioContent.push(response.audioContent);
  // }

  // const concatenatedAudio = Buffer.concat(audioContent);

  // // Write the binary audio content to a local file
  // const writeFile = util.promisify(fs.writeFile);
  // await writeFile("output.mp3", concatenatedAudio, "binary");
  // const endTime = new Date();

  // console.log(
  //   `Audio content generated in ${
  //     (endTime - startTime) / 1000
  //   } seconds and written to output.mp3`
  // );
}

readTranscript();
