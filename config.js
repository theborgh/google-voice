const { voiceCodes: vc } = require("./googleVoiceData.js");

const characterVoices = [
  { regExp: /^Q[\.:]/, voiceCode: vc.MaleSpanishPolyglot_Standard },
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
  { regExp: /^\(/, voiceCode: vc.MaleGerman_Neural2 },
];

const defaultVoice = vc.MaleGerman_Neural2;

const configObj = {
  inputFile: "input.txt",
  // regExp that defines the separator between chunks. Chunks are spoken by a single voice.
  chunkSplitRegExp: /\r\n\r\n/,
  // if true, the character voice regExp is removed from the text that will be spoken.
  removeVoiceRegexpFromInput: true,
  // defines which voice is used when the chunk is not matched by any character voice regExp.
  // true: use the previous voice, false: use the default voice
  stickyVoices: false,
};

module.exports = { characterVoices, defaultVoice, configObj };
