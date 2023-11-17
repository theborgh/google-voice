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
  FemaleBritish_WaveNet: "en-GB-News-H",
  FemaleAussie_Standard: "en-AU-Standard-A",
  FemaleUS_WaveNet: "en-US-News-L",
  FemaleFilipino_WaveNet: "fil-PH-Wavenet-A",
  FemaleIndian_Neural2: "en-IN-Neural2-A",
  FemaleCzech_Standard: "cs-CZ-Standard-A",
  FemaleCzech_WaveNet: "cs-CZ-Wavenet-A",
  FemaleFrench_Neural2: "fr-FR-Neural2-A",
  FemaleNorwegian_WaveNet: "nb-NO-Wavenet-C",
  FemaleBrazilian_WaveNet: "pt-BR-Wavenet-A",
  FemaleRussian_WaveNet: "ru-RU-Wavenet-A",
  FemaleSpanish_Neural2: "es-ES-Neural2-C",
  FemaleSwedish_WaveNet: "sv-SE-Wavenet-A",
  MaleUS_WaveNet: "en-US-News-N",
  MaleUS2_WaveNet: "en-US-Wavenet-J",
  MaleUS3_Neural2: "en-US-Neural2-D",
  MaleUS4Polyglot_Standard: "en-US-Polyglot-1",
  MaleBritish_Neural2: "en-GB-Neural2-B",
  MaleBritish_WaveNet: "en-GB-News-J",
  MaleIndian_Neural2: "en-IN-Neural2-B",
  MaleJapanese_WaveNet: "ja-JP-Wavenet-D",
  MaleGerman_Neural2: "de-DE-Neural2-B",
  MaleItalian_Neural2: "it-IT-Neural2-C",
  MaleAussie_Neural2: "en-AU-Neural2-D",
  MaleAussie_WaveNet: "en-AU-News-G",
  MaleFrench_WaveNet: "fr-FR-Wavenet-B",
  MaleNorwegian_WaveNet: "nb-NO-Wavenet-B",
  MaleBrazilian_WaveNet: "pt-BR-Wavenet-B",
  MaleRussian_WaveNet: "ru-RU-Wavenet-B",
  MaleSpanish_Neural2: "es-ES-Neural2-F",
  MaleSwedish_WaveNet: "sv-SE-Wavenet-C",
};

module.exports = { freeTiers, voiceCodes };
