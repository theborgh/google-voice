const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const util = require("util");

const client = new textToSpeech.TextToSpeechClient();

async function quickStart() {
  // Read the contents of input.txt
  const text = fs.readFileSync("input.txt", "utf8");

  // See voices at https://cloud.google.com/text-to-speech/docs/voices
  const suitableFemaleVoices = ["en-GB-News-H"];
  const suitableMaleVoices = ["en-US-News-N", "en-US-Wavenet-J"];
  const characterVoices = [
    { separator: /^Q[\.:]/, voiceCode: "en-US-Wavenet-J" },
    { separator: /^(A[\.:]|THE WITNESS:)/, voiceCode: "en-AU-Standard-A" },
    { separator: /^THE CLERK:/, voiceCode: "en-IN-Standard-D" },
    { separator: /^THE COURT:/, voiceCode: "ja-JP-Wavenet-D" },
    { separator: /^MR. BAKER:/, voiceCode: "en-US-Wavenet-J" },
    { separator: /^MR. PETROCELLI:/, voiceCode: "en-US-News-N" },
  ];
  const defaultVoice = "de-DE-Neural2-B";

  // Separate the text into chunks based on line starts. Create an object with the charactersSeparators as keys and the chunks as values
  const chunks = text.split("\r\n\r\n");

  console.log(chunks);

  let audioContent = [];

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

    audioContent.push(response.audioContent); // Store the partial audio content
  }

  // Concatenate the partial audio content into a single Buffer
  const concatenatedAudio = Buffer.concat(audioContent);

  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile("output.mp3", concatenatedAudio, "binary");

  console.log("Audio content written to file: output.mp3");
}

quickStart();
