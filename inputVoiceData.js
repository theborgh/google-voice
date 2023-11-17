const characterVoices = [
  { separator: /^Q[\.:]/, voiceCode: "en-US-Wavenet-J" },
  { separator: /^(A[\.:]|THE WITNESS:)/, voiceCode: "en-US-Wavenet-J" },
  { separator: /^THE CLERK:/, voiceCode: "en-IN-Standard-D" },
  { separator: /^THE COURT:/, voiceCode: "ja-JP-Wavenet-D" },
  { separator: /^MR. BAKER:/, voiceCode: "en-US-Wavenet-J" },
  { separator: /^MR. P. BAKER:/, voiceCode: "en-US-Polyglot-1" },
  { separator: /^MR. PETROCELLI:/, voiceCode: "it-IT-Neural2-C" },
  { separator: /^MR. KELLY:/, voiceCode: "en-US-Polyglot-1" },
  { separator: /^MS. SAGER:/, voiceCode: "en-AU-Standard-A" },
];

const defaultVoice = "de-DE-Neural2-B";

module.exports = { characterVoices, defaultVoice };
