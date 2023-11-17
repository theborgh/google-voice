const { voiceCodes: vc } = require("./googleVoiceData.js");

const characterVoices = [
  { separator: /^Q[\.:]/, voiceCode: vc.MaleItalian_Neural2 },
  {
    separator: /^(A[\.:]|THE WITNESS:)/,
    voiceCode: vc.MaleUS2_WaveNet,
  },
  { separator: /^THE CLERK:/, voiceCode: vc.FemaleIndian_Neural2 },
  { separator: /^THE COURT:/, voiceCode: vc.MaleJapanese_WaveNet },
  { separator: /^MR. BAKER:/, voiceCode: vc.MaleUS2_WaveNet },
  {
    separator: /^MR. P. BAKER:/,
    voiceCode: vc.MaleUS4Polyglot_Standard,
  },
  { separator: /^MR. PETROCELLI:/, voiceCode: vc.MaleItalian_Neural2 },
  { separator: /^MR. KELLY:/, voiceCode: vc.MaleUS4Polyglot_Standard },
  { separator: /^MS. SAGER:/, voiceCode: vc.FemaleAussie_Standard },
];

const defaultVoice = vc.MaleGerman_Neural2;

module.exports = { characterVoices, defaultVoice };
