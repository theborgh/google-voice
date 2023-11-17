const { voiceCodes: vc } = require("./googleVoiceData.js");

const characterVoices = [
  { regExp: /^Q[\.:]/, voiceCode: vc.MaleItalian_Neural2 },
  {
    regExp: /^(A[\.:]|THE WITNESS:)/,
    voiceCode: vc.MaleUS2_WaveNet,
  },
  { regExp: /^THE CLERK:/, voiceCode: vc.FemaleIndian_Neural2 },
  { regExp: /^THE COURT:/, voiceCode: vc.MaleJapanese_WaveNet },
  { regExp: /^MR. BAKER:/, voiceCode: vc.MaleUS2_WaveNet },
  {
    regExp: /^MR. P. BAKER:/,
    voiceCode: vc.MaleUS4Polyglot_Standard,
  },
  { regExp: /^MR. BLASIER:/, voiceCode: vc.MaleUS_WaveNet },
  { regExp: /^MR. PETROCELLI:/, voiceCode: vc.MaleItalian_Neural2 },
  { regExp: /^MR. KELLY:/, voiceCode: vc.MaleUS4Polyglot_Standard },
  { regExp: /^MS. SAGER:/, voiceCode: vc.FemaleAussie_Standard },
];

const defaultVoice = vc.MaleGerman_Neural2;

module.exports = { characterVoices, defaultVoice };
