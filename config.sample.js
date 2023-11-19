const { synthesizer, voiceCodes: vc } = require("./googleVoiceData.js");

const characterVoices = [
  { regExp: /^Q[\.:]/, voiceCode: vc.MaleUS4_Standard },
  {
    regExp: /^(A[\.:]|THE WITNESS:)/,
    voiceCode: vc.MaleUS3_Standard,
  },
  { regExp: /^THE CLERK:/, voiceCode: vc.FemaleIndian_WaveNet },
  { regExp: /^THE COURT:/, voiceCode: vc.MaleJapanese_WaveNet },
  { regExp: /^MR. BAKER:/, voiceCode: vc.MaleUS2_WaveNet },
  {
    regExp: /^MR. P. BAKER:/,
    voiceCode: vc.MaleUS4Polyglot_WaveNet,
  },
  { regExp: /^MR. BLASIER:/, voiceCode: vc.MaleUS_WaveNet },
  { regExp: /^MR. PETROCELLI:/, voiceCode: vc.MaleItalian_WaveNet },
  { regExp: /^MR. BREWER:/, voiceCode: vc.MaleAussie2_WaveNet },
  { regExp: /^MR. MEDVENE:/, voiceCode: vc.MaleUS4_Standard },
  { regExp: /^MR. KELLY:/, voiceCode: vc.MaleUS4Polyglot_WaveNet },
  { regExp: /^MS. SAGER:/, voiceCode: vc.FemaleAussie_WaveNet },
  { regExp: /^JURORS:/, voiceCode: vc.MaleUS3_WaveNet },
  { regExp: /^\(/, voiceCode: vc.MaleGerman_WaveNet },
];

const defaultVoice = vc.MaleGerman_WaveNet;

const configObj = {
  synthesizer,
  inputFile: "input.txt",
  outputFile: "output",
  outputFileFormat: "mp3",
  // regExp to run on the input text before splitting it into chunks
  preprocessRegexp: null,
  // string to replace the matches of the preprocessRegexp with
  preprocessReplaceString: "",
  // regExp that defines the separator between chunks. Chunks are spoken by a single voice.
  chunkSplitRegExp: /\r\n\r\n/,
  // if true, the character voice regExp is removed from the text that will be spoken.
  removeVoiceRegexpFromInput: true,
  // defines which voice is used when the chunk is not matched by any character voice regExp.
  // true: use the previous voice, false: use the default voice
  stickyVoices: true,
};

module.exports = { characterVoices, defaultVoice, configObj };
