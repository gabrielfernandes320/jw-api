const mongoose = require("mongoose");

const CharacterSchema = new mongoose.Schema({
  name: String,
  profession: String,
});

module.exports = mongoose.model("Character", CharacterSchema);
