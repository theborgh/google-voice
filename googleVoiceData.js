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
  { voiceCode: "en-US-Polyglot-1", sex: "male", voiceType: "Standard" },
  { voiceCode: "en-IN-Neural2-B", sex: "male", voiceType: "Neural2" },
  { voiceCode: "ja-JP-Wavenet-D", sex: "male", voiceType: "WaveNet" },
  { voiceCode: "de-DE-Neural2-B", sex: "male", voiceType: "Neural2" },
  { voiceCode: "it-IT-Neural2-C", sex: "male", voiceType: "Neural2" },
];

module.exports = { voicePool, freeTiers };
