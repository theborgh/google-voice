const textToSpeech = require("@google-cloud/text-to-speech");
const client = new textToSpeech.TextToSpeechClient();

// See https://cloud.google.com/text-to-speech/pricing
const freeTiers = [
  { voiceType: "Neural2", freeCharsPerMonth: 800_000 }, // 1_000_000 bytes
  { voiceType: "Polyglot", freeCharsPerMonth: 800_000 }, // 1_000_000 bytes
  { voiceType: "Studio", freeCharsPerMonth: 80_000 }, // 100_000 bytes
  { voiceType: "WaveNet", freeCharsPerMonth: 1_000_000 },
  { voiceType: "Standard", freeCharsPerMonth: 4_000_000 },
];

// See voices at https://cloud.google.com/text-to-speech/docs/voices
// MUST name the keys with _ and then exactly the voiceType for stats to work
const voiceCodes = {
  FemaleAussie_Standard: "en-AU-Standard-A",
  FemaleAussie_WaveNet: "en-AU-Wavenet-C",
  FemaleBrazilian_Standard: "pt-BR-Standard-A",
  FemaleBrazilian_WaveNet: "pt-BR-Wavenet-A",
  FemaleBritish_Standard: "en-GB-Standard-A",
  FemaleBritish_WaveNet: "en-GB-News-H",
  FemaleCzech_Standard: "cs-CZ-Standard-A",
  FemaleCzech_WaveNet: "cs-CZ-Wavenet-A",
  FemaleFrench_Standard: "fr-FR-Standard-A",
  FemaleFrench_WaveNet: "fr-FR-Neural2-A",
  FemaleFilipino_Standard: "fil-PH-Standard-A",
  FemaleFilipino_WaveNet: "fil-PH-Wavenet-A",
  FemaleGerman_Standard: "de-DE-Standard-A",
  FemaleGerman_WaveNet: "de-DE-Wavenet-A",
  FemaleIndian_Standard: "en-IN-Standard-A",
  FemaleIndian_WaveNet: "en-IN-Neural2-A",
  FemaleItalian_Standard: "it-IT-Standard-A",
  FemaleItalian_WaveNet: "it-IT-Wavenet-A",
  FemaleItalian2_Standard: "it-IT-Standard-B",
  FemaleItalian_WaveNet: "it-IT-Wavenet-B",
  FemaleNorwegian_Standard: "nb-NO-Standard-A",
  FemaleNorwegian_WaveNet: "nb-NO-Wavenet-C",
  FemaleRussian_Standard: "ru-RU-Standard-A",
  FemaleRussian_WaveNet: "ru-RU-Wavenet-A",
  FemaleSpanish_Standard: "es-ES-Standard-A",
  FemaleSpanish_WaveNet: "es-ES-Neural2-C",
  FemaleSwedish_Standard: "sv-SE-Standard-A",
  FemaleSwedish_WaveNet: "sv-SE-Wavenet-A",
  FemaleUS_Standard: "en-US-Standard-C",
  FemaleUS_WaveNet: "en-US-News-L",
  FemaleUS2_Standard: "en-US-Standard-E",
  FemaleUS2_WaveNet: "en-US-Neural2-C",
  FemaleUS3_Standard: "en-US-Standard-G",
  FemaleUS3_WaveNet: "en-US-Neural2-E",

  MaleAussie_Standard: "en-AU-Standard-B",
  MaleAussie_WaveNet: "en-AU-Polyglot-1",
  MaleAussie2_Standard: "en-AU-Standard-D",
  MaleAussie2_WaveNet: "en-AU-Neural2-D",
  MaleAussie3_WaveNet: "en-AU-News-G",
  MaleBrazilian_Standard: "pt-BR-Standard-B",
  MaleBrazilian_WaveNet: "pt-BR-Wavenet-B",
  MaleBritish_Standard: "en-GB-Standard-B",
  MaleBritish_WaveNet: "en-GB-Neural2-B",
  MaleBritish2_Standard: "en-GB-Standard-D",
  MaleBritish2_WaveNet: "en-GB-News-J",
  MaleFrenchPolyglot_WaveNet: "fr-FR-Polyglot-1",
  MaleFrench_Standard: "fr-FR-Standard-B",
  MaleFrench2_Standard: "fr-FR-Standard-D",
  MaleFrench_WaveNet: "fr-FR-Wavenet-B",
  MaleGermanPolyglot_WaveNet: "de-DE-Polyglot-1",
  MaleGerman_Standard: "de-DE-Standard-B",
  MaleGerman2_Standard: "de-DE-Standard-E",
  MaleGerman_WaveNet: "de-DE-Neural2-B",
  MaleIndian_Standard: "en-IN-Standard-B",
  MaleIndian_WaveNet: "en-IN-Neural2-B",
  MaleItalian_Standard: "it-IT-Standard-C",
  MaleItalian_WaveNet: "it-IT-Neural2-C",
  MaleItalian2_Standard: "it-IT-Standard-D",
  MaleItalian2_WaveNet: "it-IT-Wavenet-C",
  MaleJapanese_Standard: "ja-JP-Standard-C",
  MaleJapanese_WaveNet: "ja-JP-Wavenet-D",
  MaleNorwegian_Standard: "nb-NO-Standard-B",
  MaleNorwegian_WaveNet: "nb-NO-Wavenet-B",
  MaleRussian_Standard: "ru-RU-Standard-B",
  MaleRussian_WaveNet: "ru-RU-Wavenet-B",
  MaleSpanish_Standard: "es-ES-Standard-B",
  MaleSpanish_WaveNet: "es-ES-Neural2-F",
  MaleSpanishPolyglot_WaveNet: "es-ES-Polyglot-1",
  MaleSwedish_Standard: "sv-SE-Standard-D",
  MaleSwedish_WaveNet: "sv-SE-Wavenet-C",
  MaleUS_Standard: "en-US-Standard-A",
  MaleUS_WaveNet: "en-US-News-N",
  MaleUS2_Standard: "en-US-Standard-B",
  MaleUS2_WaveNet: "en-US-Wavenet-J",
  MaleUS3_Standard: "en-US-Standard-J",
  MaleUS3_WaveNet: "en-US-Neural2-D",
  MaleUS4_Standard: "en-US-Standard-I",
  MaleUS4Polyglot_WaveNet: "en-US-Polyglot-1",
  MaleUSSpanishPolyglot_WaveNet: "es-US-Polyglot-1",
};

const createRequestObject = (
  textToSpeak,
  voiceCodeToUse,
  outputFileFormat
) => ({
  input: {
    text: textToSpeak,
  },
  voice: {
    languageCode:
      voiceCodeToUse.split("-")[0] + "-" + voiceCodeToUse.split("-")[1],
    name: voiceCodeToUse,
  },
  audioConfig: { audioEncoding: outputFileFormat },
});

const synthesize = async (...args) => {
  const [response] = await client.synthesizeSpeech(...args);
  return response;
};

const mapResponseToAudioContent = (response) => response.audioContent;

module.exports = {
  freeTiers,
  voiceCodes,
  synthesizer: {
    synthesize,
    createRequestObject,
    mapResponseToAudioContent,
  },
};
