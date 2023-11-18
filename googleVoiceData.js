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
  FemaleIndian_WaveNet: "en-IN-Neural2-A",
  FemaleItalian_WaveNet: "it-IT-Wavenet-A",
  FemaleCzech_Standard: "cs-CZ-Standard-A",
  FemaleCzech_WaveNet: "cs-CZ-Wavenet-A",
  FemaleFrench_WaveNet: "fr-FR-Neural2-A",
  FemaleNorwegian_WaveNet: "nb-NO-Wavenet-C",
  FemaleBrazilian_WaveNet: "pt-BR-Wavenet-A",
  FemaleRussian_WaveNet: "ru-RU-Wavenet-A",
  FemaleSpanish_WaveNet: "es-ES-Neural2-C",
  FemaleSwedish_WaveNet: "sv-SE-Wavenet-A",
  MaleUS_WaveNet: "en-US-News-N",
  MaleUS2_WaveNet: "en-US-Wavenet-J",
  MaleUS3_WaveNet: "en-US-Neural2-D",
  MaleUS4Polyglot_WaveNet: "en-US-Polyglot-1",
  MaleAussiePolyglot_WaveNet: "en-AU-Polyglot-1",
  MaleFrenchPolyglot_WaveNet: "fr-FR-Polyglot-1",
  MaleGermanPolyglot_WaveNet: "de-DE-Polyglot-1",
  MaleSpanishPolyglot_WaveNet: "es-ES-Polyglot-1",
  MaleUSSpanishPolyglot_WaveNet: "es-US-Polyglot-1",
  MaleBritish_WaveNet: "en-GB-Neural2-B",
  MaleBritish_WaveNet: "en-GB-News-J",
  MaleIndian_WaveNet: "en-IN-Neural2-B",
  MaleJapanese_WaveNet: "ja-JP-Wavenet-D",
  MaleGerman_WaveNet: "de-DE-Neural2-B",
  MaleItalian_WaveNet: "it-IT-Neural2-C",
  MaleItalian_WaveNet: "it-IT-Wavenet-C",
  MaleItalian_Standard: "it-IT-Standard-C",
  MaleAussie_WaveNet: "en-AU-Neural2-D",
  MaleAussie_WaveNet: "en-AU-News-G",
  MaleFrench_WaveNet: "fr-FR-Wavenet-B",
  MaleNorwegian_WaveNet: "nb-NO-Wavenet-B",
  MaleBrazilian_WaveNet: "pt-BR-Wavenet-B",
  MaleRussian_WaveNet: "ru-RU-Wavenet-B",
  MaleSpanish_WaveNet: "es-ES-Neural2-F",
  MaleSwedish_WaveNet: "sv-SE-Wavenet-C",
};

module.exports = { freeTiers, voiceCodes };
