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
  MaleUS_WaveNet: "en-US-News-N",
  MaleUS2_WaveNet: "en-US-Wavenet-J",
  MaleUS3_Neural2: "en-US-Neural2-D",
  MaleUS4Polyglot_Standard: "en-US-Polyglot-1",
  MaleIndian_Neural2: "en-IN-Neural2-B",
  MaleJapanese_WaveNet: "ja-JP-Wavenet-D",
  MaleGerman_Neural2: "de-DE-Neural2-B",
  MaleItalian_Neural2: "it-IT-Neural2-C",
};

module.exports = { freeTiers, voiceCodes };
