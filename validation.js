const { voiceCodes: vc } = require("./googleVoiceData.js");

const checkForInvalidVoices = (characterVoices) => {
  const validVoices = Object.values(vc);
  const characterVoicesArray = characterVoices.map((cv) => cv.voiceCode);

  return characterVoicesArray.findIndex((cv) => !validVoices.includes(cv));
};

module.exports = { checkForInvalidVoices };
