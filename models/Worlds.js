const mongoose = require("mongoose");

const WorldSchema = new mongoose.Schema({
  description: String,
});

module.exports = mongoose.model("World", WorldSchema);
