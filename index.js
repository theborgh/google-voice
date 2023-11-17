const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const util = require("util");

const client = new textToSpeech.TextToSpeechClient();

async function readTranscript() {
  // Read the contents of input.txt
  const text = fs.readFileSync("input.txt", "utf8");

  // See voices at https://cloud.google.com/text-to-speech/docs/voices
  const suitableFemaleVoices = [
    "en-GB-News-H",
    "en-AU-Standard-A",
    "en-US-News-L",
    "fil-PH-Wavenet-A",
  ];
  const suitableMaleVoices = [
    "en-US-News-N",
    "en-US-Wavenet-J",
    "en-US-Neural2-D",
    "en-US-Polyglot-1",
    "en-IN-Neural2-B",
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

  // Separate the text into chunks based on line starts.
  const chunks = text.split("\r\n\r\n");
  const audioContent = [];
  const startTime = new Date();

  for (const chunk of chunks) {
    // Get the voice code for the chunk
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
  }

  const concatenatedAudio = Buffer.concat(audioContent);

  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile("output.mp3", concatenatedAudio, "binary");
  const endTime = new Date();

  console.log(
    `Audio content generated in ${
      (endTime - startTime) / 1000
    } seconds and written to output.mp3`
  );
}

readTranscript();
