const mongoose = require('mongoose');

const challengeDataSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  img: { type: String, required: true },
  vdo: { type: String, required: true },
  topic: { type: String, required: true },
});

module.exports = mongoose.model("challengeData", challengeDataSchema);