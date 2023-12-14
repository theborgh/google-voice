const { synthesizer, voiceCodes: vc } = require("./googleVoiceData.js");

module.exports = {
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
  // defines which voice is used when the chunk is not matched by any character voice regExp.
  // true: use the previous voice, false: use the default voice
  stickyVoices: true,
  // For logging stats to console and stats.csv and keeping track of monthly quotas
  loggedVoiceTypes: ["Wavenet", "Standard"],
  defaultVoice: vc.MaleAussie2_WaveNet,
  characterVoices: [
    { regExp: /^THE CLERK:/, voiceCode: vc.FemaleAussie_WaveNet },
    { regExp: /^THE BAILIFF:/, voiceCode: vc.MaleBrazilian_WaveNet },
    { regExp: /^THE COURT:/, voiceCode: vc.MaleBritish_WaveNet },
    { regExp: /^THE VIDEOGRAPHER:/, voiceCode: vc.MaleUS_WaveNet },
    {
      regExp: /^MR. BAKER:/,
      voiceCode: vc.MaleUS2_WaveNet,
    },
    {
      regExp: /^MR. P. BAKER:/,
      voiceCode: vc.MaleUS_Standard,
    },
    {
      regExp: /^MR. BLASIER:/,
      voiceCode: vc.MaleUS_WaveNet,
    },
    {
      regExp: /^MR. LEONARD:/,
      voiceCode: vc.MaleUS4Polyglot_WaveNet,
    },
    {
      regExp: /^MR. PETROCELLI:/,
      voiceCode: vc.MaleBritish2_WaveNet,
    },
    {
      regExp: /^MR. BREWER:/,
      voiceCode: vc.MaleAussie2_WaveNet,
    },
    {
      regExp: /^MR. MEDVENE:/,
      voiceCode: vc.MaleUS3_WaveNet,
    },
    {
      regExp: /^MR. KELLY:/,
      voiceCode: vc.MaleUS4Polyglot_WaveNet,
    },
    {
      regExp: /^MR. LAMBERT:/,
      voiceCode: vc.MaleAussie2_WaveNet,
    },
    {
      regExp: /^MR. GELBLUM:/,
      voiceCode: vc.MaleAussie_WaveNet,
    },
    {
      regExp: /^MS. SAGER:/,
      voiceCode: vc.FemaleAussie_WaveNet,
    },
    { regExp: /^JURORS:/, voiceCode: vc.MaleUS3_WaveNet },
    { regExp: /^Q[\.:]( \(BY .*\))?/, voiceCode: vc.MaleBritish2_WaveNet },
    {
      regExp: /^(A[\.:]|THE WITNESS:)/,
      voiceCode: vc.MaleUS_WaveNet,
    },
    {
      regExp: /^(?=\(|DIRECT|CROSS|REDIRECT|RECROSS)/,
      voiceCode: vc.MaleAussie2_WaveNet,
    },
  ],
};
